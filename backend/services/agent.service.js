import axios from 'axios';
import FormData from 'form-data';
import { AgentJob } from '../models/AgentJob.js';
import { DraftPost } from '../models/DraftPost.js';

const PYTHON_AGENT_BASE_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:5000';
const MUSIC_AGENT_URL = process.env.MUSIC_SUGGESTION_AGENT_URL || 'http://localhost:5004';

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
            callMusicAgent(draftId, originalCaption, originalImages)  // Pass images for context
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

// Call Image Agent - Updated implementation
const callImageAgent = async (draftId, images) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'processing' }
        );

        // Convert image URLs to base64
        const imagesBase64 = [];
        for (const img of images) {
            try {
                const response = await axios.get(img.url, { responseType: 'arraybuffer' });
                const base64 = Buffer.from(response.data).toString('base64');
                imagesBase64.push(`data:image/jpeg;base64,${base64}`);
            } catch (error) {
                console.error(`Failed to download image: ${img.url}`);
            }
        }

        if (imagesBase64.length === 0) {
            throw new Error('No images could be processed');
        }

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL.replace('5000', '5001')}/process-images`, {
            images: imagesBase64,
            platform: 'instagram_post',
            filters: ['enhanced', 'vibrant', 'professional', 'bold'],
            enhance: true,
            cropMode: 'center'
        }, {
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'completed' }
        );

        if (response.data.success) {
            console.log(`✓ Images processed: ${response.data.count} images with variants`);
            return response.data.processedImages;
        } else {
            return [];
        }
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'failed' }
        );
        console.error('Image agent error:', error.message);
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

// Call Music Agent - Updated with proper integration
const callMusicAgent = async (draftId, caption, images) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'processing' }
        );

        // Prepare description from caption and image context
        let description = caption || 'Generate music suggestions';

        // If we have images, add context about them
        if (images && images.length > 0) {
            description += ` with ${images.length} image${images.length > 1 ? 's' : ''}`;
        }

        const response = await axios.post(`${MUSIC_AGENT_URL}/suggest-music`, {
            description: description,
            caption: caption || '',
            limit: 5
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'completed' }
        );

        if (response.data.success) {
            console.log(`✓ Music suggestions generated: ${response.data.count} tracks for mood: ${response.data.detectedMood}`);
            return response.data.suggestions;
        } else {
            console.warn('Music agent returned unsuccessful response');
            return [];
        }
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'failed' }
        );
        console.error('Music agent error:', error.message);

        // Return fallback music suggestions
        return [
            {
                title: "Feel Good Music",
                artist: "Upbeat Playlist",
                mood: "upbeat",
                genre: "Pop"
            },
            {
                title: "Happy Vibes",
                artist: "Positive Mix",
                mood: "happy",
                genre: "Pop"
            },
            {
                title: "Energy Boost",
                artist: "Motivational Tracks",
                mood: "energetic",
                genre: "Dance"
            }
        ];
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
