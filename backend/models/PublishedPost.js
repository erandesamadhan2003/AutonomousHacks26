import mongoose from "mongoose";

const publishedPostSchema = new mongoose.Schema({
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
    draftPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DraftPost'
    },
    platform: {
        type: String,
        enum: ['instagram', 'linkedin', 'facebook', 'twitter'],
        required: true
    },
    platformPostId: {
        type: String,
        required: true,
        unique: true
    },

    // Published Content
    caption: String,
    hashtags: [String],
    mediaUrls: [String],
    postType: {
        type: String,
        enum: ['image', 'video', 'carousel', 'reel']
    },

    // Engagement Metrics (updated periodically)
    metrics: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        saves: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        reach: { type: Number, default: 0 },
        impressions: { type: Number, default: 0 },
        engagement_rate: { type: Number, default: 0 }
    },

    // Metric History (snapshots over time)
    metricsHistory: [{
        timestamp: Date,
        likes: Number,
        comments: Number,
        shares: Number,
        views: Number
    }],

    publishedAt: {
        type: Date,
        default: Date.now
    },
    lastMetricsUpdate: {
        type: Date
    },

    // AI Analysis
    performanceAnalysis: {
        performanceScore: Number, // 0-100
        topPerformingElements: [String], // e.g., ['hashtag:#sunset', 'caption_tone:casual']
        insights: String,
        analyzedAt: Date
    }

}, {
    timestamps: true
});

publishedPostSchema.index({ userId: 1, publishedAt: -1 });

// Add methods before module.exports
publishedPostSchema.methods.updateMetrics = async function (newMetrics) {
    this.metrics = { ...this.metrics, ...newMetrics };
    this.lastMetricsUpdate = new Date();
    await this.save();
    return this;
};

publishedPostSchema.methods.calculateEngagementRate = function () {
    const { likes, comments, shares, views } = this.metrics;
    if (views === 0) return 0;
    const engagementRate = ((likes + comments + shares) / views) * 100;
    return parseFloat(engagementRate.toFixed(2));
};

publishedPostSchema.methods.addMetricsSnapshot = async function () {
    const snapshot = {
        timestamp: new Date(),
        likes: this.metrics.likes,
        comments: this.metrics.comments,
        shares: this.metrics.shares,
        views: this.metrics.views
    };
    this.metricsHistory.push(snapshot);
    await this.save();
    return this;
};

export const PublishedPost = mongoose.model('PublishedPost', publishedPostSchema);