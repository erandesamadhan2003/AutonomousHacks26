import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export const AUTH_URL = {
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    GOOGLE_AUTH: `/auth/google`,
    GET_PROFILE: `/auth/profile`,
    LOGOUT: `/auth/logout`,
};

export const DASHBOARD_URL = {
    OVERVIEW: `/dashboard/overview`,
    RECENT_ACTIVITY: `/dashboard/recent-activity`,
    QUICK_STATS: `/dashboard/quick-stats`,
    TOP_POSTS: `/dashboard/top-posts`,
    ENGAGEMENT_CHART: `/dashboard/engagement-chart`,
    CONNECTED_ACCOUNTS: `/dashboard/connected-accounts`,
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
        if (config.data instanceof FormData) {
            console.log('📦 FormData payload');
        }
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data?.message || error.message);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export { api };

