import { api } from "@/api/api";

const ANALYTICS_BASE = '/analytics';

export const getOverview = async (filters = {}) => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/overview`, { params: filters });
        return data;
    } catch (error) {
        console.error("Get overview error:", error);
        throw error;
    }
};

export const getPostAnalytics = async (id) => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/post/${id}`);
        return data;
    } catch (error) {
        console.error("Get post analytics error:", error);
        throw error;
    }
};

export const refreshMetrics = async (id) => {
    try {
        const { data } = await api.post(`${ANALYTICS_BASE}/refresh/${id}`);
        return data;
    } catch (error) {
        console.error("Refresh metrics error:", error);
        throw error;
    }
};

export const getEngagementTrend = async (period = '30d') => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/engagement-trend`, {
            params: { period }
        });
        return data;
    } catch (error) {
        console.error("Get engagement trend error:", error);
        throw error;
    }
};

export const getTopPosts = async (filters = {}) => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/top-posts`, { params: filters });
        return data;
    } catch (error) {
        console.error("Get top posts error:", error);
        throw error;
    }
};

export const getHashtagPerformance = async (period = '30d') => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/hashtags`, {
            params: { period }
        });
        return data;
    } catch (error) {
        console.error("Get hashtag performance error:", error);
        throw error;
    }
};

export const getBestPostingTimes = async (period = '30d') => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/best-times`, {
            params: { period }
        });
        return data;
    } catch (error) {
        console.error("Get best posting times error:", error);
        throw error;
    }
};

export const getInsights = async (period = '30d') => {
    try {
        const { data } = await api.get(`${ANALYTICS_BASE}/insights`, {
            params: { period }
        });
        return data;
    } catch (error) {
        console.error("Get insights error:", error);
        throw error;
    }
};
