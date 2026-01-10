import axios from 'axios';
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
            callCaptionAgent(draftId, originalCaption, platforms),
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
const callCaptionAgent = async (draftId, caption, platforms) => {
    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'processing' }
        );

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL}/agents/caption`, {
            draftId,
            caption,
            platforms
        }, { timeout: 30000 });

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'completed' }
        );

        return response.data.captions;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'failed' }
        );
        console.error('Caption agent error:', error);
        return [];
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
