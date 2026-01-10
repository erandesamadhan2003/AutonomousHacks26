import axios from 'axios';
import { AGENT_URLS } from '../config/constants.js';

export const processImagesWithAgent = async (images, description) => {
    try {
        const response = await axios.post(`${AGENT_URLS.IMAGE_PROCESSING}/process-images`, {
            images,
            description
        }, {
            timeout: 60000 // 60 seconds
        });
        return response.data;
    } catch (error) {
        console.error('Image processing agent error:', error);
        throw new Error('Failed to process images');
    }
};

export const generateCaptionsWithAgent = async (description, images, userPreferences) => {
    try {
        const response = await axios.post(`${AGENT_URLS.CAPTION_GENERATION}/generate-captions`, {
            description,
            images,
            preferences: userPreferences
        }, {
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        console.error('Caption generation agent error:', error);
        throw new Error('Failed to generate captions');
    }
};

export const generateVideoWithAgent = async (images, description) => {
    try {
        const response = await axios.post(`${AGENT_URLS.VIDEO_GENERATION}/generate-video`, {
            images,
            description
        }, {
            timeout: 120000 // 2 minutes for video generation
        });
        return response.data;
    } catch (error) {
        console.error('Video generation agent error:', error);
        throw new Error('Failed to generate video');
    }
};

export const suggestMusicWithAgent = async (description, mood) => {
    try {
        const response = await axios.post(`${AGENT_URLS.MUSIC_SUGGESTION}/suggest-music`, {
            description,
            mood
        }, {
            timeout: 30000
        });
        return response.data;
    } catch (error) {
        console.error('Music suggestion agent error:', error);
        throw new Error('Failed to suggest music');
    }
};

export const processAllAgents = async (draftPost, userPreferences) => {
    try {
        const results = await Promise.allSettled([
            processImagesWithAgent(draftPost.uploadedImages, draftPost.userDescription),
            generateCaptionsWithAgent(draftPost.userDescription, draftPost.uploadedImages, userPreferences),
            generateVideoWithAgent(draftPost.uploadedImages, draftPost.userDescription),
            suggestMusicWithAgent(draftPost.userDescription, 'upbeat')
        ]);

        const agentResults = {
            imageProcessing: results[0].status === 'fulfilled' ? results[0].value : null,
            captionGeneration: results[1].status === 'fulfilled' ? results[1].value : null,
            videoGeneration: results[2].status === 'fulfilled' ? results[2].value : null,
            musicSuggestion: results[3].status === 'fulfilled' ? results[3].value : null
        };

        // Update draft post with results
        if (agentResults.imageProcessing) {
            draftPost.processedImages = agentResults.imageProcessing.images;
            await draftPost.updateAgentStatus('imageProcessing', 'completed');
        } else {
            await draftPost.updateAgentStatus('imageProcessing', 'failed', results[0].reason?.message);
        }

        if (agentResults.captionGeneration) {
            draftPost.generatedCaptions = agentResults.captionGeneration.captions;
            draftPost.hashtags = agentResults.captionGeneration.hashtags || [];
            await draftPost.updateAgentStatus('captionGeneration', 'completed');
        } else {
            await draftPost.updateAgentStatus('captionGeneration', 'failed', results[1].reason?.message);
        }

        if (agentResults.videoGeneration) {
            draftPost.generatedVideo = agentResults.videoGeneration.video;
            await draftPost.updateAgentStatus('videoGeneration', 'completed');
        } else {
            await draftPost.updateAgentStatus('videoGeneration', 'failed', results[2].reason?.message);
        }

        if (agentResults.musicSuggestion) {
            draftPost.musicSuggestions = agentResults.musicSuggestion.suggestions;
            await draftPost.updateAgentStatus('musicSuggestion', 'completed');
        } else {
            await draftPost.updateAgentStatus('musicSuggestion', 'failed', results[3].reason?.message);
        }

        // Update overall status
        if (draftPost.isReadyToPublish()) {
            draftPost.status = 'ready';
        }
        await draftPost.save();

        return agentResults;
    } catch (error) {
        console.error('Process all agents error:', error);
        throw error;
    }
};
