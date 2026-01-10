import { api } from "@/api/api";

const PREFERENCES_BASE = '/preferences';

export const getPreferences = async () => {
    try {
        const { data } = await api.get(PREFERENCES_BASE);
        return data;
    } catch (error) {
        console.error("Get preferences error:", error);
        throw error;
    }
};

export const updatePreferences = async (updates) => {
    try {
        const { data } = await api.patch(PREFERENCES_BASE, updates);
        return data;
    } catch (error) {
        console.error("Update preferences error:", error);
        throw error;
    }
};
