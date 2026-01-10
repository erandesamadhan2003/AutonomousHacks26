import { api } from "../api/api";

const ANALYTICS_URL = {
    GET_DASHBOARD: `/analytics/dashboard`,
    GET_PERFORMANCE: `/analytics/performance`,
    GET_INSIGHTS: `/analytics/insights`,
    GET_POST_ANALYTICS: `/analytics/posts`,
    GET_ENGAGEMENT: `/analytics/engagement`,
};

export const getDashboardAnalytics = async (dateRange = {}) => {
    try {
        const response = await api.get(ANALYTICS_URL.GET_DASHBOARD, { params: dateRange });
        return response.data;
    } catch (error) {
        console.error("Get dashboard analytics error:", error);
        throw error;
    }
};

export const getPerformanceAnalytics = async (filters = {}) => {
    try {
        const response = await api.get(ANALYTICS_URL.GET_PERFORMANCE, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Get performance analytics error:", error);
        throw error;
    }
};

export const getInsights = async (filters = {}) => {
    try {
        const response = await api.get(ANALYTICS_URL.GET_INSIGHTS, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Get insights error:", error);
        throw error;
    }
};

export const getPostAnalytics = async (postId) => {
    try {
        const response = await api.get(`${ANALYTICS_URL.GET_POST_ANALYTICS}/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Get post analytics error:", error);
        throw error;
    }
};

export const getEngagementMetrics = async (filters = {}) => {
    try {
        const response = await api.get(ANALYTICS_URL.GET_ENGAGEMENT, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Get engagement metrics error:", error);
        throw error;
    }
};
