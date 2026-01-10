import { useState, useCallback } from "react";
import {
    getDashboardAnalytics,
    getPerformanceAnalytics,
    getInsights,
    getPostAnalytics,
    getEngagementMetrics,
} from "@/services/analytics.service";

export const useAnalytics = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [insightsData, setInsightsData] = useState(null);
    const [postAnalytics, setPostAnalytics] = useState(null);
    const [engagementData, setEngagementData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async (dateRange = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboardAnalytics(dateRange);
            setDashboardData(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dashboard analytics");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPerformance = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPerformanceAnalytics(filters);
            setPerformanceData(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch performance analytics");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchInsights = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInsights(filters);
            setInsightsData(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch insights");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPostAnalytics = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPostAnalytics(postId);
            setPostAnalytics(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch post analytics");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchEngagement = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEngagementMetrics(filters);
            setEngagementData(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch engagement metrics");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        dashboardData,
        performanceData,
        insightsData,
        postAnalytics,
        engagementData,
        loading,
        error,
        fetchDashboard,
        fetchPerformance,
        fetchInsights,
        fetchPostAnalytics,
        fetchEngagement,
        clearError,
    };
};
