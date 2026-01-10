export const PLATFORMS = {
    INSTAGRAM: 'instagram',
    LINKEDIN: 'linkedin',
    FACEBOOK: 'facebook',
    TWITTER: 'twitter'
};

export const POST_STATUS = {
    DRAFT: 'draft',
    PROCESSING: 'processing',
    READY: 'ready',
    SCHEDULED: 'scheduled',
    PUBLISHED: 'published',
    FAILED: 'failed'
};

export const AGENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

export const AGENT_TYPES = {
    IMAGE_PROCESSING: 'image_processing',
    CAPTION_GENERATION: 'caption_generation',
    VIDEO_GENERATION: 'video_generation',
    MUSIC_SUGGESTION: 'music_suggestion'
};

export const POST_TYPES = {
    IMAGE: 'image',
    VIDEO: 'video',
    CAROUSEL: 'carousel',
    REEL: 'reel'
};

export const BRAND_TONES = {
    PROFESSIONAL: 'professional',
    CASUAL: 'casual',
    FRIENDLY: 'friendly',
    AUTHORITATIVE: 'authoritative',
    PLAYFUL: 'playful'
};

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Not authorized, please login',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Server error occurred',
    INVALID_TOKEN: 'Invalid or expired token',
    ACCOUNT_NOT_FOUND: 'Social account not found',
    POST_NOT_READY: 'Post is not ready for publishing'
};

export const RATE_LIMITS = {
    GENERAL: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100
    },
    AUTH: {
        windowMs: 15 * 60 * 1000,
        max: 5
    },
    UPLOAD: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20
    }
};

export const FILE_LIMITS = {
    IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
    MAX_FILES: 10
};

export const AGENT_URLS = {
    IMAGE_PROCESSING: process.env.IMAGE_PROCESSING_AGENT_URL || 'http://localhost:5001',
    CAPTION_GENERATION: process.env.CAPTION_GENERATION_AGENT_URL || 'http://localhost:5002',
    VIDEO_GENERATION: process.env.VIDEO_GENERATION_AGENT_URL || 'http://localhost:5003',
    MUSIC_SUGGESTION: process.env.MUSIC_SUGGESTION_AGENT_URL || 'http://localhost:5004'
};
