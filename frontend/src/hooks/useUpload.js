import { useState } from "react";
import {
    uploadImage,
    uploadVideo,
    uploadFile,
    deleteFile,
} from "@/services/upload.service";

export const useUpload = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const uploadImageFile = async (file) => {
        setLoading(true);
        setError(null);
        setProgress(0);
        try {
            const data = await uploadImage(file, (percent) => setProgress(percent));
            setUploadedFile(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload image");
            throw err;
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const uploadVideoFile = async (file) => {
        setLoading(true);
        setError(null);
        setProgress(0);
        try {
            const data = await uploadVideo(file, (percent) => setProgress(percent));
            setUploadedFile(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload video");
            throw err;
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const upload = async (file, fileType) => {
        setLoading(true);
        setError(null);
        setProgress(0);
        try {
            const data = await uploadFile(file, fileType, (percent) =>
                setProgress(percent)
            );
            setUploadedFile(data);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload file");
            throw err;
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const remove = async (fileId) => {
        setLoading(true);
        setError(null);
        try {
            await deleteFile(fileId);
            if (uploadedFile?.id === fileId) {
                setUploadedFile(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete file");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);
    const clearFile = () => setUploadedFile(null);

    return {
        loading,
        progress,
        error,
        uploadedFile,
        uploadImageFile,
        uploadVideoFile,
        upload,
        remove,
        clearError,
        clearFile,
    };
};
