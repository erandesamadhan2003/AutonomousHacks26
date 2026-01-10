import {SocialAccount} from '../models/SocialAccount.js';
import {
    exchangeInstagramCode,
    getInstagramProfile,
    exchangeLinkedInCode,
    getLinkedInProfile
} from '../services/social.service.js';

// Connect Account
export const connectAccount = async (req, res) => {
    try {
        const { code, platform, redirectUri } = req.body;
        const userId = req.user._id;

        if (!code || !platform) {
            return res.status(400).json({
                success: false,
                message: 'Code and platform are required'
            });
        }

        let accessToken, profile;

        // Exchange code for access token and get profile
        if (platform === 'instagram') {
            const tokenData = await exchangeInstagramCode(code, redirectUri);
            accessToken = tokenData.access_token;
            profile = await getInstagramProfile(accessToken);
        } else if (platform === 'linkedin') {
            const tokenData = await exchangeLinkedInCode(code, redirectUri);
            accessToken = tokenData.access_token;
            profile = await getLinkedInProfile(accessToken);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unsupported platform'
            });
        }

        // Check if account already exists
        let account = await SocialAccount.findOne({
            userId,
            platform,
            platformUserId: profile.id
        });

        if (account) {
            // Update existing account
            account.accessToken = accessToken;
            account.profile = profile;
            account.connected = true;
            account.lastSyncedAt = new Date();
        } else {
            // Create new account
            account = new SocialAccount({
                userId,
                platform,
                platformUserId: profile.id,
                accessToken,
                profile,
                connected: true,
                lastSyncedAt: new Date()
            });
        }

        await account.save();

        res.status(200).json({
            success: true,
            message: 'Account connected successfully',
            data: {
                id: account._id,
                platform: account.platform,
                profile: account.profile,
                connected: account.connected
            }
        });
    } catch (error) {
        console.error('Connect account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to connect account'
        });
    }
};

// Get Accounts
export const getAccounts = async (req, res) => {
    try {
        const userId = req.user._id;

        const accounts = await SocialAccount.find({ userId, isDeleted: false })
            .select('-accessToken -refreshToken -__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: accounts
        });
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch accounts'
        });
    }
};

// Get Account By ID
export const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const account = await SocialAccount.findOne({
            _id: id,
            userId,
            isDeleted: false
        }).select('-accessToken -refreshToken -__v');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        res.status(200).json({
            success: true,
            data: account
        });
    } catch (error) {
        console.error('Get account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch account'
        });
    }
};

// Disconnect Account
export const disconnectAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const account = await SocialAccount.findOne({
            _id: id,
            userId,
            isDeleted: false
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        account.isDeleted = true;
        account.connected = false;
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Account disconnected successfully'
        });
    } catch (error) {
        console.error('Disconnect account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to disconnect account'
        });
    }
};

// Refresh Account Data
export const refreshAccountData = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const account = await SocialAccount.findOne({
            _id: id,
            userId,
            isDeleted: false
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        // Fetch latest profile data
        let profile;
        if (account.platform === 'instagram') {
            profile = await getInstagramProfile(account.accessToken);
        } else if (account.platform === 'linkedin') {
            profile = await getLinkedInProfile(account.accessToken);
        }

        account.profile = profile;
        account.lastSyncedAt = new Date();
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Account data refreshed',
            data: {
                id: account._id,
                platform: account.platform,
                profile: account.profile,
                lastSyncedAt: account.lastSyncedAt
            }
        });
    } catch (error) {
        console.error('Refresh account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to refresh account data'
        });
    }
};
