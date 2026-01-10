import mongoose from "mongoose";

const socialAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['instagram', 'linkedin', 'facebook', 'twitter'],
        required: true
    },
    platformUserId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true,
        // Encrypt this in production
    },
    refreshToken: {
        type: String
    },
    tokenExpiresAt: {
        type: Date
    },
    profileData: {
        displayName: String,
        profilePicture: String,
        followerCount: Number,
        followingCount: Number,
        bio: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permissions: [{
        type: String // e.g., 'publish_content', 'read_insights'
    }]
}, {
    timestamps: true
});

// Compound index for user-platform uniqueness
socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

// Add methods before module.exports
socialAccountSchema.methods.isTokenExpired = function () {
    if (!this.tokenExpiresAt) return false;
    return new Date() >= this.tokenExpiresAt;
};

socialAccountSchema.methods.updateTokens = async function (newAccessToken, newRefreshToken, expiresAt) {
    this.accessToken = newAccessToken;
    if (newRefreshToken) this.refreshToken = newRefreshToken;
    if (expiresAt) this.tokenExpiresAt = expiresAt;
    await this.save();
    return this;
};

export const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);

