import { UserPreferences } from '../models/UserPreferences.js';

// Get Preferences
export const getPreferences = async (req, res) => {
    try {
        const userId = req.user._id;

        let preferences = await UserPreferences.findOne({ userId });

        if (!preferences) {
            // Create default preferences
            preferences = await UserPreferences.create({
                userId,
                brandVoice: {
                    tone: 'professional',
                    style: 'informative',
                    keywords: []
                },
                platformPreferences: {
                    instagram: { enabled: true, autoPost: false, bestTimes: [] },
                    linkedin: { enabled: true, autoPost: false, bestTimes: [] }
                },
                notifications: {
                    email: true,
                    push: true,
                    postPublished: true,
                    metricsUpdate: false,
                    weeklyReport: true
                },
                aiSettings: {
                    captionVariations: 3,
                    imageEnhancements: true,
                    videoGeneration: true,
                    musicSuggestions: true
                }
            });
        }

        res.status(200).json({
            success: true,
            data: preferences
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch preferences'
        });
    }
};

// Update Preferences
export const updatePreferences = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        let preferences = await UserPreferences.findOne({ userId });

        if (!preferences) {
            preferences = new UserPreferences({ userId });
        }

        // Update fields
        if (updates.brandVoice) {
            preferences.brandVoice = { ...preferences.brandVoice, ...updates.brandVoice };
        }
        if (updates.platformPreferences) {
            preferences.platformPreferences = { ...preferences.platformPreferences, ...updates.platformPreferences };
        }
        if (updates.notifications) {
            preferences.notifications = { ...preferences.notifications, ...updates.notifications };
        }
        if (updates.aiSettings) {
            preferences.aiSettings = { ...preferences.aiSettings, ...updates.aiSettings };
        }

        await preferences.save();

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            data: preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update preferences'
        });
    }
};
