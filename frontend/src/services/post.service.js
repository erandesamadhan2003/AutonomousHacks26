import { api } from "@/api/api";

const POST_BASE = '/api/posts';

// Draft Management
export const createDraft = async (formData) => {
    try {
        const { data } = await api.post(`${POST_BASE}/draft`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } catch (error) {
        console.error("Create draft error:", error);
        throw error;
    }
};

export const getDrafts = async (filters = {}) => {
    try {
        const { data } = await api.get(`${POST_BASE}/drafts`, { params: filters });
        return data;
    } catch (error) {
        console.error("Get drafts error:", error);
        throw error;
    }
};

export const getDraftById = async (id) => {
    try {
        const { data } = await api.get(`${POST_BASE}/draft/${id}`);
        return data;
    } catch (error) {
        console.error("Get draft by ID error:", error);
        throw error;
    }
};

export const updateDraft = async (id, updates) => {
    try {
        const { data } = await api.patch(`${POST_BASE}/draft/${id}`, updates);
        return data;
    } catch (error) {
        console.error("Update draft error:", error);
        throw error;
    }
};

export const deleteDraft = async (id) => {
    try {
        const { data } = await api.delete(`${POST_BASE}/draft/${id}`);
        return data;
    } catch (error) {
        console.error("Delete draft error:", error);
        throw error;
    }
};

// Publishing
export const publishPost = async (publishData) => {
    try {
        const { data } = await api.post(`${POST_BASE}/publish`, publishData);
        return data;
    } catch (error) {
        console.error("Publish post error:", error);
        throw error;
    }
};

// Published Posts
export const getPublishedPosts = async (filters = {}) => {
    try {
        const { data } = await api.get(`${POST_BASE}/published`, { params: filters });
        return data;
    } catch (error) {
        console.error("Get published posts error:", error);
        throw error;
    }
};

export const getPublishedPostById = async (id) => {
    try {
        const { data } = await api.get(`${POST_BASE}/published/${id}`);
        return data;
    } catch (error) {
        console.error("Get published post error:", error);
        throw error;
    }
};

export const deletePublishedPost = async (id) => {
    try {
        const { data } = await api.delete(`${POST_BASE}/published/${id}`);
        return data;
    } catch (error) {
        console.error("Delete published post error:", error);
        throw error;
    }
};
