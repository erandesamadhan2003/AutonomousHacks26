import { useEffect, useState, useCallback } from "react";
import {
    getDashboardOverview,
    getRecentActivity,
    getQuickStats,
    getTopPerformingPosts,
    getEngagementChart,
    getConnectedAccountsOverview,
    getAllDashboardData,
} from "@/services/dashboard.service";

export const useDashboard = () => {
    const [data, setData] = useState({
        overview: {
            stats: {
                totalPosts: 0,
                totalEngagement: 0,
                connectedAccounts: 0,
                avgEngagementRate: 0,
                changes: { posts: 0, engagement: 0, avgRate: 0 },
            },
        },
        recentActivities: [],
        quickStats: {
            postsThisWeek: 0,
            draftsPending: 0,
            scheduledPosts: 0,
            processingPosts: 0,
        },
        topPosts: [],
        engagementChart: [],
        connectedAccounts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('30d');

    const fetchAllData = useCallback(async (selectedPeriod = '30d') => {
        setLoading(true);
        setError(null);
        try {
            const allData = await getAllDashboardData(selectedPeriod);
            setData({
                overview: allData.overview?.data || allData.overview || {},
                recentActivities: allData.activities?.data || allData.activities || [],
                quickStats: allData.stats?.data || allData.stats || {},
                topPosts: allData.topPosts?.data || allData.topPosts || [],
                engagementChart: allData.chartData?.data || allData.chartData || [],
                connectedAccounts: allData.accounts?.data || allData.accounts || [],
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshData = useCallback(
        async (selectedPeriod = period) => {
            setPeriod(selectedPeriod);
            await fetchAllData(selectedPeriod);
        },
        [period, fetchAllData]
    );

    useEffect(() => {
        fetchAllData(period);
    }, []);

    return {
        data,
        loading,
        error,
        period,
        refresh: refreshData,
    };
};
