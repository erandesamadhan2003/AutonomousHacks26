import { api } from "@/api/api";

const SOCIAL_BASE = '/api/social-accounts';

export const getAccounts = async () => {
    try {
        const { data } = await api.get(SOCIAL_BASE);
        return data;
    } catch (error) {
        console.error("Get accounts error:", error);
        throw error;
    }
};

export const connectAccount = async (platform, code, redirectUri) => {
    try {
        const { data } = await api.post(`${SOCIAL_BASE}/connect`, {
            platform,
            code,
            redirectUri
        });
        return data;
    } catch (error) {
        console.error("Connect account error:", error);
        throw error;
    }
};

export const getAccountById = async (id) => {
    try {
        const { data } = await api.get(`${SOCIAL_BASE}/${id}`);
        return data;
    } catch (error) {
        console.error("Get account by ID error:", error);
        throw error;
    }
};

export const disconnectAccount = async (id) => {
    try {
        const { data } = await api.delete(`${SOCIAL_BASE}/${id}`);
        return data;
    } catch (error) {
        console.error("Disconnect account error:", error);
        throw error;
    }
};

export const refreshAccountData = async (id) => {
    try {
        const { data } = await api.post(`${SOCIAL_BASE}/${id}/refresh`);
        return data;
    } catch (error) {
        console.error("Refresh account data error:", error);
        throw error;
    }
};
