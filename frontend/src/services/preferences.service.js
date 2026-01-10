import { api } from "../api/api";

const PREFERENCES_URL = {
    GET_PREFERENCES: `/preferences`,
    UPDATE_PREFERENCES: `/preferences`,
    GET_NOTIFICATIONS: `/preferences/notifications`,
    UPDATE_NOTIFICATIONS: `/preferences/notifications`,
    GET_THEME: `/preferences/theme`,
    UPDATE_THEME: `/preferences/theme`,
};

export const getPreferences = async () => {
    try {
        const response = await api.get(PREFERENCES_URL.GET_PREFERENCES);
        return response.data;
    } catch (error) {
        console.error("Get preferences error:", error);
        throw error;
    }
};

export const updatePreferences = async (preferencesData) => {
    try {
        const response = await api.put(PREFERENCES_URL.UPDATE_PREFERENCES, preferencesData);
        return response.data;
    } catch (error) {
        console.error("Update preferences error:", error);
        throw error;
    }
};

export const getNotificationSettings = async () => {
    try {
        const response = await api.get(PREFERENCES_URL.GET_NOTIFICATIONS);
        return response.data;
    } catch (error) {
        console.error("Get notification settings error:", error);
        throw error;
    }
};

export const updateNotificationSettings = async (notificationData) => {
    try {
        const response = await api.put(PREFERENCES_URL.UPDATE_NOTIFICATIONS, notificationData);
        return response.data;
    } catch (error) {
        console.error("Update notification settings error:", error);
        throw error;
    }
};

export const getTheme = async () => {
    try {
        const response = await api.get(PREFERENCES_URL.GET_THEME);
        return response.data;
    } catch (error) {
        console.error("Get theme error:", error);
        throw error;
    }
};

export const updateTheme = async (themeData) => {
    try {
        const response = await api.put(PREFERENCES_URL.UPDATE_THEME, themeData);
        return response.data;
    } catch (error) {
        console.error("Update theme error:", error);
        throw error;
    }
};
