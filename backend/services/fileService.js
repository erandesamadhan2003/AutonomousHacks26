import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

export const uploadToCloudinary = async (filePath, folder = 'social-media-posts') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto'
        });

        // Delete local file after upload
        fs.unlinkSync(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to cloud storage');
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
};

export const generateThumbnail = async (videoUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = videoUrl.split('/');
        const publicIdWithExt = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExt.split('.')[0];

        const thumbnailUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            format: 'jpg',
            transformation: [
                { width: 640, height: 360, crop: 'fill' }
            ]
        });

        return thumbnailUrl;
    } catch (error) {
        console.error('Generate thumbnail error:', error);
        return null;
    }
};

export const validateFile = (file) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

    const isImage = allowedImageTypes.includes(file.mimetype);
    const isVideo = allowedVideoTypes.includes(file.mimetype);

    if (!isImage && !isVideo) {
        throw new Error('Invalid file type. Only images and videos are allowed');
    }

    const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos

    if (file.size > maxSize) {
        throw new Error(`File size exceeds ${isImage ? '10MB' : '100MB'} limit`);
    }

    return true;
};

export const getFileUrl = (publicId) => {
    return cloudinary.url(publicId, {
        secure: true
    });
};
