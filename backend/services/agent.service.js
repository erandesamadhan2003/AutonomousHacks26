import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { AgentJob } from '../models/AgentJob.js';
import { DraftPost } from '../models/DraftPost.js';

const PYTHON_AGENT_BASE_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:5000';

// Start agent pipeline
export const startAgentPipeline = async ({ draftId, userId, originalCaption, originalImages, platforms }) => {
    try {
        const job = await AgentJob.create({
            draftId,
            userId,
            status: 'pending',
            agentStatuses: {
                captionAgent: 'pending',
                imageAgent: 'pending',
                videoAgent: 'pending',
                musicAgent: 'pending'
            }
        });

        // Call all agents in parallel
        const agentPromises = [
            callCaptionAgent(draftId, originalCaption, platforms, originalImages),
            callImageAgent(draftId, originalImages),
            callVideoAgent(draftId, originalImages),
            callMusicAgent(draftId, originalCaption)
        ];

        Promise.all(agentPromises)
            .then(async ([captions, images, video, music]) => {
                await updateDraftWithResults(draftId, { captions, images, video, music });
                await AgentJob.findByIdAndUpdate(job._id, {
                    status: 'completed',
                    completedAt: new Date()
                });
            })
            .catch(async (error) => {
                console.error('Agent pipeline error:', error);
                await AgentJob.findByIdAndUpdate(job._id, {
                    status: 'failed',
                    error: error.message,
                    completedAt: new Date()
                });
            });

        return job;
    } catch (error) {
        console.error('Start agent pipeline error:', error);
        throw error;
    }
};

// Call Caption Agent
const callCaptionAgent = async (draftId, caption, platforms, images) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'processing' }
        );

        // Generate captions for each platform
        const captions = [];

        for (const platform of platforms) {
            // Use the first image for caption optimization
            const imageUrl = images && images.length > 0 ? images[0].url : null;

            if (!imageUrl) {
                console.warn('No image available for caption optimization');
                continue;
            }

            // For Instagram optimization
            if (platform === 'instagram') {
                const formData = new FormData();

                // Download image and send it as file
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                formData.append('image', Buffer.from(imageResponse.data), {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg'
                });
                formData.append('intent', caption || 'Generate engaging caption for social media');

                const response = await axios.post(
                    `${PYTHON_AGENT_BASE_URL}/api/instagram/optimize`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                        timeout: 30000
                    }
                );

                if (response.data.success) {
                    captions.push({
                        platform: 'instagram',
                        text: response.data.caption,
                        hashtags: response.data.hashtags
                    });
                }
            } else {
                // For other platforms, use generic caption
                captions.push({
                    platform,
                    text: caption || 'Check out this amazing content!',
                    hashtags: []
                });
            }
        }

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'completed' }
        );

        return captions;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'failed' }
        );
        console.error('Caption agent error:', error);
        return [{
            platform: platforms[0] || 'instagram',
            text: caption || 'Check out this post!',
            hashtags: []
        }];
    }
};

// Call Image Agent
const callImageAgent = async (draftId, images) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'processing' }
        );

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL}/agents/image`, {
            draftId,
            images
        }, { timeout: 60000 });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'completed' }
        );

        return response.data.images;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'failed' }
        );
        console.error('Image agent error:', error);
        return [];
    }
};

// Call Video Agent
const callVideoAgent = async (draftId, images) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'processing' }
        );

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL}/agents/video`, {
            draftId,
            images
        }, { timeout: 120000 });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'completed' }
        );

        return response.data.video;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'failed' }
        );
        console.error('Video agent error:', error);
        return null;
    }
};

// Call Music Agent
const callMusicAgent = async (draftId, caption) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'processing' }
        );

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL}/agents/music`, {
            draftId,
            caption
        }, { timeout: 30000 });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'completed' }
        );

        return response.data.suggestions;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'failed' }
        );
        console.error('Music agent error:', error);
        return [];
    }
};

// Update draft with agent results
const updateDraftWithResults = async (draftId, { captions, images, video, music }) => {
    try {
        const draft = await DraftPost.findById(draftId);
        if (!draft) return;

        if (captions && captions.length > 0) {
            draft.aiGeneratedCaptions = captions;
            draft.selectedCaption = captions[0]?.text || draft.originalCaption;

            // Extract all hashtags from generated captions
            const allHashtags = captions.flatMap(c => c.hashtags || []);
            if (allHashtags.length > 0) {
                draft.hashtags = [...new Set([...draft.hashtags, ...allHashtags])];
            }
        }

        if (images && images.length > 0) {
            draft.aiGeneratedImages = images;
        }

        if (video) {
            draft.aiGeneratedVideo = video;
        }

        if (music && music.length > 0) {
            draft.musicSuggestions = music;
        }

        draft.status = 'ready';
        await draft.save();
    } catch (error) {
        console.error('Update draft with results error:', error);
    }
};

// Get agent job status
export const getAgentJobStatus = async (jobId) => {
    try {
        const job = await AgentJob.findById(jobId);
        return job;
    } catch (error) {
        console.error('Get agent job status error:', error);
        throw error;
    }
};
