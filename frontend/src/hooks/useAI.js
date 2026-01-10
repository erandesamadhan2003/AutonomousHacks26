import { useState } from "react";
import {
    editImage,
    generateImage,
    enhanceImage,
    generateVideo,
    getMusicSuggestions,
    generateCaption,
    generateHashtags,
} from "@/services/ai.service";

export const useAI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const edit = async (imageData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await editImage(imageData);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to edit image");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const generate = async (prompt) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateImage(prompt);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate image");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const enhance = async (imageData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await enhanceImage(imageData);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to enhance image");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createVideo = async (videoData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateVideo(videoData);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate video");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMusicSuggestions = async (preferences = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMusicSuggestions(preferences);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to get music suggestions");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createCaption = async (contentData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateCaption(contentData);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate caption");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createHashtags = async (contentData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateHashtags(contentData);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate hashtags");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearResult = () => setResult(null);

    return {
        loading,
        error,
        result,
        edit,
        generate,
        enhance,
        createVideo,
        fetchMusicSuggestions,
        createCaption,
        createHashtags,
        clearError,
        clearResult,
    };
};
