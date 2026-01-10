import { useState } from "react";
import { createDraft } from "@/services/post.service";

export const useCreateContent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [draftId, setDraftId] = useState(null);
    const [jobId, setJobId] = useState(null);

    const create = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await createDraft(formData);
            setDraftId(response.data.draftId);
            setJobId(response.data.jobId);
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create draft");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setDraftId(null);
        setJobId(null);
        setError(null);
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
