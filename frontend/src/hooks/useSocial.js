import { useState, useEffect, useCallback } from "react";
import {
    getSocialAccounts,
    addSocialAccount,
    removeSocialAccount,
    updateSocialAccount,
} from "@/services/social.service";

export const useSocial = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSocialAccounts();
            setAccounts(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch accounts");
        } finally {
            setLoading(false);
        }
    }, []);

    const addAccount = async (accountData) => {
        setLoading(true);
        setError(null);
        try {
            const newAccount = await addSocialAccount(accountData);
            setAccounts((prev) => [...prev, newAccount]);
            return newAccount;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeAccount = async (accountId) => {
        setLoading(true);
        setError(null);
        try {
            await removeSocialAccount(accountId);
            setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateAccount = async (accountId, accountData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAccount = await updateSocialAccount(accountId, accountData);
            setAccounts((prev) =>
                prev.map((acc) => (acc.id === accountId ? updatedAccount : acc))
            );
            return updatedAccount;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update account");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        accounts,
        loading,
        error,
        addAccount,
        removeAccount,
        updateAccount,
        refreshAccounts: fetchAccounts,
        clearError,
    };
};
