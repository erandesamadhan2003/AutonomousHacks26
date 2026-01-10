import { useState, useEffect, useCallback } from "react";
import {
    getDrafts,
    getDraftById,
    updateDraft,
    deleteDraft,
    publishPost
} from "@/services/post.service";

export const useDrafts = (initialFilters = {}) => {
    const [drafts, setDrafts] = useState([]);
    const [currentDraft, setCurrentDraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchDrafts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDrafts(filters);
            setDrafts(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch drafts");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchDraftById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDraftById(id);
            setCurrentDraft(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch draft");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id, updates) => {
        setLoading(true);
        setError(null);
        try {
            const response = await updateDraft(id, updates);
            setCurrentDraft(response.data);
            await fetchDrafts();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update draft");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteDraft(id);
            await fetchDrafts();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete draft");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const publish = async (draftId, platforms) => {
        setLoading(true);
        setError(null);
        try {
            const response = await publishPost({ draftId, platforms });
            await fetchDrafts();
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to publish post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, [fetchDrafts]);

    return {
        drafts,
        currentDraft,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        fetchDrafts,
        fetchDraftById,
        update,
        remove,
        publish
    };
};
