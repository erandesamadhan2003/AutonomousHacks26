import { api } from "../api/api";

const UPLOAD_URL = {
    UPLOAD_IMAGE: `/upload/image`,
    UPLOAD_VIDEO: `/upload/video`,
    UPLOAD_FILE: `/upload/file`,
    DELETE_FILE: `/upload`,
};

export const uploadImage = async (file, onProgress) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post(UPLOAD_URL.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload image error:", error);
        throw error;
    }
};

export const uploadVideo = async (file, onProgress) => {
    try {
        const formData = new FormData();
        formData.append('video', file);

        const response = await api.post(UPLOAD_URL.UPLOAD_VIDEO, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload video error:", error);
        throw error;
    }
};

export const uploadFile = async (file, fileType, onProgress) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);

        const response = await api.post(UPLOAD_URL.UPLOAD_FILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });
        return response.data;
    } catch (error) {
        console.error("Upload file error:", error);
        throw error;
    }
};

export const deleteFile = async (fileId) => {
    try {
        const response = await api.delete(`${UPLOAD_URL.DELETE_FILE}/${fileId}`);
        return response.data;
    } catch (error) {
        console.error("Delete file error:", error);
        throw error;
    }
};
