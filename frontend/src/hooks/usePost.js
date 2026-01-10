import { useState, useCallback } from "react";
import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    schedulePost,
    publishPost,
    getDrafts,
    getScheduledPosts,
    getPublishedPosts,
} from "@/services/post.service";

export const usePost = () => {
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPosts = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPosts(filters);
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch posts");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPost = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPost(postId);
            setCurrentPost(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const create = async (postData) => {
        setLoading(true);
        setError(null);
        try {
            const newPost = await createPost(postData);
            setPosts((prev) => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const update = async (postId, postData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedPost = await updatePost(postId, postData);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? updatedPost : post))
            );
            if (currentPost?.id === postId) {
                setCurrentPost(updatedPost);
            }
            return updatedPost;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            await deletePost(postId);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
            if (currentPost?.id === postId) {
                setCurrentPost(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const schedule = async (postId, scheduleData) => {
        setLoading(true);
        setError(null);
        try {
            const scheduledPost = await schedulePost(postId, scheduleData);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? scheduledPost : post))
            );
            return scheduledPost;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to schedule post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const publish = async (postId) => {
        setLoading(true);
        setError(null);
        try {
            const publishedPost = await publishPost(postId);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? publishedPost : post))
            );
            return publishedPost;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to publish post");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchDrafts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDrafts();
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch drafts");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchScheduled = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getScheduledPosts();
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch scheduled posts");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPublished = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPublishedPosts();
            setPosts(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch published posts");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        posts,
        currentPost,
        loading,
        error,
        fetchPosts,
        fetchPost,
        create,
        update,
        remove,
        schedule,
        publish,
        fetchDrafts,
        fetchScheduled,
        fetchPublished,
        clearError,
    };
};
