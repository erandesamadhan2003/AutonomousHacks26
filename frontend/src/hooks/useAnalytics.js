import { useState, useEffect, useCallback } from "react";
import {
    getOverview,
    getPostAnalytics,
    refreshMetrics,
    getEngagementTrend,
    getTopPosts,
    getHashtagPerformance,
    getBestPostingTimes,
    getInsights
} from "@/services/analytics.service";

export const useAnalytics = (initialFilters = {}) => {
    const [data, setData] = useState({
        overview: null,
        engagementTrend: [],
        topPosts: [],
        hashtags: [],
        bestTimes: null,
        insights: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [overview, trend, top, hashtags, times, insights] = await Promise.all([
                getOverview(filters),
                getEngagementTrend(filters.period || '30d'),
                getTopPosts({ ...filters, limit: 10 }),
                getHashtagPerformance(filters.period || '30d'),
                getBestPostingTimes(filters.period || '30d'),
                getInsights(filters.period || '30d')
            ]);

            setData({
                overview: overview.data,
                engagementTrend: trend.data,
                topPosts: top.data,
                hashtags: hashtags.data,
                bestTimes: times.data,
                insights: insights.data
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchPostAnalytics = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPostAnalytics(id);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch post analytics");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refresh = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await refreshMetrics(postId);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to refresh metrics");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        data,
        loading,
        error,
        filters,
        setFilters,
        fetchAll,
        fetchPostAnalytics,
        refresh
    };
};
