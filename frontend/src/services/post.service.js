import { api } from "../api/api";

const POST_URL = {
    CREATE_POST: `/posts`,
    GET_POSTS: `/posts`,
    GET_POST: `/posts`,
    UPDATE_POST: `/posts`,
    DELETE_POST: `/posts`,
    SCHEDULE_POST: `/posts/schedule`,
    PUBLISH_POST: `/posts/publish`,
    GET_DRAFTS: `/posts/drafts`,
    GET_SCHEDULED: `/posts/scheduled`,
    GET_PUBLISHED: `/posts/published`,
};

export const createPost = async (postData) => {
    try {
        const response = await api.post(POST_URL.CREATE_POST, postData);
        return response.data;
    } catch (error) {
        console.error("Create post error:", error);
        throw error;
    }
};

export const getPosts = async (filters = {}) => {
    try {
        const response = await api.get(POST_URL.GET_POSTS, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Get posts error:", error);
        throw error;
    }
};

export const getPost = async (postId) => {
    try {
        const response = await api.get(`${POST_URL.GET_POST}/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Get post error:", error);
        throw error;
    }
};

export const updatePost = async (postId, postData) => {
    try {
        const response = await api.put(`${POST_URL.UPDATE_POST}/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error("Update post error:", error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        const response = await api.delete(`${POST_URL.DELETE_POST}/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Delete post error:", error);
        throw error;
    }
};

export const schedulePost = async (postId, scheduleData) => {
    try {
        const response = await api.post(`${POST_URL.SCHEDULE_POST}/${postId}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error("Schedule post error:", error);
        throw error;
    }
};

export const publishPost = async (postId) => {
    try {
        const response = await api.post(`${POST_URL.PUBLISH_POST}/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Publish post error:", error);
        throw error;
    }
};

export const getDrafts = async () => {
    try {
        const response = await api.get(POST_URL.GET_DRAFTS);
        return response.data;
    } catch (error) {
        console.error("Get drafts error:", error);
        throw error;
    }
};

export const getScheduledPosts = async () => {
    try {
        const response = await api.get(POST_URL.GET_SCHEDULED);
        return response.data;
    } catch (error) {
        console.error("Get scheduled posts error:", error);
        throw error;
    }
};

export const getPublishedPosts = async () => {
    try {
        const response = await api.get(POST_URL.GET_PUBLISHED);
        return response.data;
    } catch (error) {
        console.error("Get published posts error:", error);
        throw error;
    }
};
