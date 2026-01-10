import mongoose from "mongoose";

const draftPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    socialAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SocialAccount',
        required: true
    },
    platform: {
        type: String,
        enum: ['instagram', 'linkedin', 'facebook', 'twitter'],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'processing', 'ready', 'scheduled', 'published', 'failed'],
        default: 'draft'
    },

    // User Input
    userDescription: {
        type: String,
        required: true
    },
    uploadedImages: [{
        url: String,
        filename: String,
        size: Number
    }],

    // Agent Generated Content
    processedImages: [{
        url: String,
        variant: String, // 'original', 'enhanced', 'filtered'
    }],
    generatedCaptions: [{
        text: String,
        tone: String, // 'professional', 'casual', 'creative'
        score: Number // AI confidence score
    }],
    selectedCaption: {
        type: String
    },
    hashtags: [{
        tag: String,
        relevanceScore: Number
    }],
    generatedVideo: {
        url: String,
        duration: Number,
        thumbnail: String
    },
    musicSuggestions: [{
        title: String,
        artist: String,
        mood: String,
        spotifyUrl: String,
        instagramAudioId: String
    }],
    selectedMusic: {
        type: mongoose.Schema.Types.Mixed
    },

    // Scheduling
    scheduledAt: {
        type: Date
    },
    publishedAt: {
        type: Date
    },

    // Agent Processing Status
    agentStatus: {
        imageProcessing: {
            status: String, // 'pending', 'processing', 'completed', 'failed'
            completedAt: Date,
            error: String
        },
        captionGeneration: {
            status: String,
            completedAt: Date,
            error: String
        },
        videoGeneration: {
            status: String,
            completedAt: Date,
            error: String
        },
        musicSuggestion: {
            status: String,
            completedAt: Date,
            error: String
        }
    },

    // Publishing
    publishedPostId: {
        type: String // Platform's post ID
    },
    publishError: {
        type: String
    }

}, {
    timestamps: true
});

draftPostSchema.index({ userId: 1, status: 1 });
draftPostSchema.index({ scheduledAt: 1 });

// Add methods before module.exports
draftPostSchema.methods.updateAgentStatus = async function (agentType, status, error = null) {
    if (!this.agentStatus[agentType]) {
        this.agentStatus[agentType] = {};
    }
    this.agentStatus[agentType].status = status;
    if (status === 'completed') {
        this.agentStatus[agentType].completedAt = new Date();
    }
    if (error) {
        this.agentStatus[agentType].error = error;
    }
    await this.save();
    return this;
};

draftPostSchema.methods.isReadyToPublish = function () {
    const agents = ['imageProcessing', 'captionGeneration', 'videoGeneration', 'musicSuggestion'];
    return agents.every(agent =>
        this.agentStatus[agent]?.status === 'completed' ||
        this.agentStatus[agent]?.status === 'failed'
    );
};

draftPostSchema.methods.getProgress = function () {
    const agents = ['imageProcessing', 'captionGeneration', 'videoGeneration', 'musicSuggestion'];
    const completed = agents.filter(agent => this.agentStatus[agent]?.status === 'completed').length;
    return Math.round((completed / agents.length) * 100);
};

export const DraftPost = mongoose.model('DraftPost', draftPostSchema);
