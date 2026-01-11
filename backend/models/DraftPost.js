import mongoose from "mongoose";

const draftPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalCaption: {
        type: String,
        default: ''
    },
    originalImages: [{
        url: String,
        publicId: String,
        format: String,
        width: Number,
        height: Number
    }],
    platforms: [{
        type: String,
        enum: ['instagram', 'facebook', 'linkedin', 'twitter'],
        default: ['instagram']
    }],
    hashtags: [String],

    // AI Generated Content
    aiGeneratedCaptions: [{
        platform: String,
        text: String,
        hashtags: [String]
    }],
    aiGeneratedImages: [{
        id: Number,
        platform: String,
        dimensions: {
            width: Number,
            height: Number
        },
        variants: [{
            variant: String,
            name: String,
            url: String,
            width: Number,
            height: Number
        }],
        variantCount: Number
    }],
    aiGeneratedVideo: {
        url: String,
        format: String,
        size: String,
        generatedAt: Date,
        sourceImage: String
    },
    musicSuggestions: [{
        title: String,
        artist: String,
        album: String,
        mood: String,
        genre: String,
        previewUrl: String,
        artwork: String,
        releaseDate: String,
        trackTime: Number,
        iTunesUrl: String
    }],

    // Selected Content (what user chooses to publish)
    selectedCaption: String,
    selectedImages: [{
        url: String,
        publicId: String
    }],
    selectedVideo: {
        url: String,
        format: String
    },
    selectedMusic: {
        title: String,
        artist: String,
        url: String
    },

    scheduledFor: Date,
    publishedAt: Date,

    status: {
        type: String,
        enum: ['processing', 'ready', 'scheduled', 'published', 'failed'],
        default: 'processing'
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

// Indexes
draftPostSchema.index({ userId: 1, status: 1 });
draftPostSchema.index({ userId: 1, createdAt: -1 });

export const DraftPost = mongoose.model('DraftPost', draftPostSchema);
