import { useState, useEffect, useCallback } from "react";
import {
    getPreferences,
    updatePreferences,
    getNotificationSettings,
    updateNotificationSettings,
    getTheme,
    updateTheme,
} from "@/services/preferences.service";

export const usePreferences = () => {
    const [preferences, setPreferences] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [theme, setTheme] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPreferences = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPreferences();
            setPreferences(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch preferences");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = async (preferencesData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updatePreferences(preferencesData);
            setPreferences(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update preferences");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotificationSettings();
            setNotifications(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch notification settings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateNotifications = async (notificationData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updateNotificationSettings(notificationData);
            setNotifications(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update notification settings");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchTheme = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTheme();
            setTheme(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch theme");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const changeTheme = async (themeData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updateTheme(themeData);
            setTheme(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update theme");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    return {
        preferences,
        notifications,
        theme,
        loading,
        error,
        update,
        fetchNotifications,
        updateNotifications,
        fetchTheme,
        changeTheme,
        refreshPreferences: fetchPreferences,
        clearError,
    };
};
