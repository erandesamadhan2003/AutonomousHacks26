import { api } from "@/api/api";
import { useState } from "react";

export const useCreateContent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [draftId, setDraftId] = useState(null);
    const [jobId, setJobId] = useState(null);

    const create = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Creating draft...');
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
            }

            const response = await api.post('/posts/draft', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ Draft created successfully:', response.data);

            setDraftId(response.data.data.draftId);
            setJobId(response.data.data.jobId);

            return response.data;
        } catch (err) {
            console.error('❌ Create draft error:', err);
            console.error('Response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || "Failed to create draft";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setDraftId(null);
        setJobId(null);
        setError(null);
        setLoading(false);
    };

    return {
        create,
        loading,
        error,
        draftId,
        jobId,
        reset
    };
};
