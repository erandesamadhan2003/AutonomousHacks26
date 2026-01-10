import { api, DASHBOARD_URL } from "@/api/api";

export const getDashboardOverview = async (period = '30d') => {
    try {
        const { data } = await api.get(DASHBOARD_URL.OVERVIEW, { params: { period } });
        return data;
    } catch (error) {
        console.error("Dashboard overview error:", error);
        throw error;
    }
};

export const getRecentActivity = async (limit = 10) => {
    try {
        const { data } = await api.get(DASHBOARD_URL.RECENT_ACTIVITY, { params: { limit } });
        return data;
    } catch (error) {
        console.error("Recent activity error:", error);
        throw error;
    }
};

export const getQuickStats = async () => {
    try {
        const { data } = await api.get(DASHBOARD_URL.QUICK_STATS);
        return data;
    } catch (error) {
        console.error("Quick stats error:", error);
        throw error;
    }
};

export const getTopPerformingPosts = async (limit = 6, period = '30d') => {
    try {
        const { data } = await api.get(DASHBOARD_URL.TOP_POSTS, { params: { limit, period } });
        return data;
    } catch (error) {
        console.error("Top posts error:", error);
        throw error;
    }
};

export const getEngagementChart = async (period = '30d') => {
    try {
        const { data } = await api.get(DASHBOARD_URL.ENGAGEMENT_CHART, { params: { period } });
        return data;
    } catch (error) {
        console.error("Engagement chart error:", error);
        throw error;
    }
};

export const getConnectedAccountsOverview = async () => {
    try {
        const { data } = await api.get(DASHBOARD_URL.CONNECTED_ACCOUNTS);
        return data;
    } catch (error) {
        console.error("Connected accounts error:", error);
        throw error;
    }
};

// Batch fetch all dashboard data
export const getAllDashboardData = async (period = '30d') => {
    try {
        const [overview, activities, stats, topPosts, chartData, accounts] = await Promise.all([
            getDashboardOverview(period),
            getRecentActivity(10),
            getQuickStats(),
            getTopPerformingPosts(6, period),
            getEngagementChart(period),
            getConnectedAccountsOverview(),
        ]);

        return {
            overview,
            activities,
            stats,
            topPosts,
            chartData,
            accounts,
        };
    } catch (error) {
        console.error("Get all dashboard data error:", error);
        throw error;
    }
};
