import { useState, useEffect, useCallback } from "react";
import { getPreferences, updatePreferences } from "@/services/preferences.service";

export const usePreferences = () => {
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPreferences();
            setPreferences(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch preferences");
        } finally {
            setLoading(false);
        }
    }, []);

    const update = async (updates) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updatePreferences(updates);
            setPreferences(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update preferences");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        preferences,
        loading,
        error,
        fetch,
        update
    };
};
