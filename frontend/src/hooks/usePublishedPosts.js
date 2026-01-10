import { useState, useEffect, useCallback } from "react";
import {
    getPublishedPosts,
    getPublishedPostById,
    deletePublishedPost
} from "@/services/post.service";

export const usePublishedPosts = (initialFilters = {}) => {
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPublishedPosts(filters);
            setPosts(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchPostById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPublishedPostById(id);
            setCurrentPost(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deletePublishedPost(id);
            await fetchPosts();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        posts,
        currentPost,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        fetchPosts,
        fetchPostById,
        remove
    };
};
