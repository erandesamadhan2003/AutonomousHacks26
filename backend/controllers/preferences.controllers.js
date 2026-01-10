import { UserPreferences } from '../models/UserPreferences.js';

export const getPreferences = async (req, res) => {
    try {
        let preferences = await UserPreferences.findOne({ userId: req.user._id });

        if (!preferences) {
            preferences = await UserPreferences.create({
                userId: req.user._id,
                brandVoice: {
                    tone: 'casual'
                }
            });
        }

        res.json({
            success: true,
            data: {
                brandVoice: preferences.brandVoice,
                platformPreferences: preferences.platformPreferences,
                learningData: preferences.learningData
            }
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching preferences'
        });
    }
};

export const updatePreferences = async (req, res) => {
    try {
        const { brandVoice, platformPreferences } = req.body;

        let preferences = await UserPreferences.findOne({ userId: req.user._id });

        if (!preferences) {
            preferences = await UserPreferences.create({
                userId: req.user._id,
                brandVoice: brandVoice || { tone: 'casual' },
                platformPreferences: platformPreferences || {}
            });
        } else {
            if (brandVoice) {
                preferences.brandVoice = { ...preferences.brandVoice, ...brandVoice };
            }
            if (platformPreferences) {
                preferences.platformPreferences = { ...preferences.platformPreferences, ...platformPreferences };
            }
            await preferences.save();
        }

        res.json({
            success: true,
            data: {
                updated: true,
                preferences: {
                    brandVoice: preferences.brandVoice,
                    platformPreferences: preferences.platformPreferences
                }
            }
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating preferences'
        });
    }
};
