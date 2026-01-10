import { useState, useEffect, useCallback } from "react";
import {
    getAccounts,
    getAccountById,
    connectAccount,
    disconnectAccount,
    refreshAccountData
} from "@/services/social.service";

export const useSocialAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAccounts();
            setAccounts(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch accounts");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAccountById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAccountById(id);
            setCurrentAccount(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const connect = async (platform, code, redirectUri) => {
        setLoading(true);
        setError(null);
        try {
            const response = await connectAccount(platform, code, redirectUri);
            await fetchAccounts();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to connect account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const disconnect = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await disconnectAccount(id);
            await fetchAccounts();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to disconnect account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refresh = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await refreshAccountData(id);
            await fetchAccounts();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to refresh account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        accounts,
        currentAccount,
        loading,
        error,
        fetchAccounts,
        fetchAccountById,
        connect,
        disconnect,
        refresh
    };
};
