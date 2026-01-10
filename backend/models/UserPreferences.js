import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Brand Voice & Style
    brandVoice: {
        tone: {
            type: String,
            enum: ['professional', 'casual', 'friendly', 'authoritative', 'playful'],
            default: 'casual'
        },
        targetAudience: String,
        industry: String,
        keyTopics: [String]
    },

    // Content Preferences per Platform
    platformPreferences: {
        instagram: {
            preferredPostTypes: [String], // ['reel', 'carousel', 'image']
            hashtagStrategy: String, // 'trending', 'niche', 'mixed'
            postingFrequency: String, // 'daily', '3x_week', 'weekly'
            bestPostingTimes: [String] // ['09:00', '18:00']
        },
        linkedin: {
            preferredPostTypes: [String],
            contentFocus: String // 'thought_leadership', 'company_updates'
        }
    },

    // AI Learning Data
    learningData: {
        successfulHashtags: [{
            tag: String,
            avgEngagement: Number,
            useCount: Number
        }],
        successfulCaptionPatterns: [{
            pattern: String,
            avgEngagement: Number
        }],
        optimalPostingTimes: [{
            dayOfWeek: Number,
            hour: Number,
            avgEngagement: Number
        }],
        topPerformingContentTypes: [{
            type: String,
            avgEngagement: Number
        }]
    }

}, {
    timestamps: true
});

// Add methods before module.exports
userPreferencesSchema.methods.updateBrandVoice = async function (brandVoice) {
    this.brandVoice = { ...this.brandVoice, ...brandVoice };
    await this.save();
    return this;
};

userPreferencesSchema.methods.updatePlatformPreferences = async function (platform, preferences) {
    if (!this.platformPreferences[platform]) {
        this.platformPreferences[platform] = {};
    }
    this.platformPreferences[platform] = { ...this.platformPreferences[platform], ...preferences };
    await this.save();
    return this;
};

userPreferencesSchema.methods.addLearningData = async function (type, data) {
    if (!this.learningData[type]) {
        this.learningData[type] = [];
    }
    this.learningData[type].push(data);
    await this.save();
    return this;
};

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
