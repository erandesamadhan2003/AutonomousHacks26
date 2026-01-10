import { api } from "../api/api";

const AI_URL = {
    EDIT_IMAGE: `/ai/image/edit`,
    GENERATE_IMAGE: `/ai/image/generate`,
    ENHANCE_IMAGE: `/ai/image/enhance`,
    GENERATE_VIDEO: `/ai/video/generate`,
    GET_MUSIC_SUGGESTIONS: `/ai/music/suggestions`,
    GENERATE_CAPTION: `/ai/caption/generate`,
    GENERATE_HASHTAGS: `/ai/hashtags/generate`,
};

export const editImage = async (imageData) => {
    try {
        const response = await api.post(AI_URL.EDIT_IMAGE, imageData);
        return response.data;
    } catch (error) {
        console.error("Edit image error:", error);
        throw error;
    }
};

export const generateImage = async (prompt) => {
    try {
        const response = await api.post(AI_URL.GENERATE_IMAGE, { prompt });
        return response.data;
    } catch (error) {
        console.error("Generate image error:", error);
        throw error;
    }
};

export const enhanceImage = async (imageData) => {
    try {
        const response = await api.post(AI_URL.ENHANCE_IMAGE, imageData);
        return response.data;
    } catch (error) {
        console.error("Enhance image error:", error);
        throw error;
    }
};

export const generateVideo = async (videoData) => {
    try {
        const response = await api.post(AI_URL.GENERATE_VIDEO, videoData);
        return response.data;
    } catch (error) {
        console.error("Generate video error:", error);
        throw error;
    }
};

export const getMusicSuggestions = async (preferences = {}) => {
    try {
        const response = await api.get(AI_URL.GET_MUSIC_SUGGESTIONS, { params: preferences });
        return response.data;
    } catch (error) {
        console.error("Get music suggestions error:", error);
        throw error;
    }
};

export const generateCaption = async (contentData) => {
    try {
        const response = await api.post(AI_URL.GENERATE_CAPTION, contentData);
        return response.data;
    } catch (error) {
        console.error("Generate caption error:", error);
        throw error;
    }
};

export const generateHashtags = async (contentData) => {
    try {
        const response = await api.post(AI_URL.GENERATE_HASHTAGS, contentData);
        return response.data;
    } catch (error) {
        console.error("Generate hashtags error:", error);
        throw error;
    }
};
