import { SocialAccount } from '../models/SocialAccount.js';

export const connectAccount = async (req, res) => {
    try {
        const { platform, code } = req.body;

        if (!platform || !code) {
            return res.status(400).json({
                success: false,
                message: 'Please provide platform and authorization code'
            });
        }

        // TODO: Exchange code for access token with platform OAuth
        // This is a placeholder - implement actual OAuth exchange
        const mockTokenData = {
            accessToken: 'mock_access_token',
            refreshToken: 'mock_refresh_token',
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            platformUserId: 'platform_user_id',
            username: 'user_' + platform,
            profileData: {
                displayName: 'User Name',
                profilePicture: 'https://example.com/pic.jpg',
                followerCount: 1000,
                followingCount: 500
            }
        };

        const existingAccount = await SocialAccount.findOne({
            userId: req.user._id,
            platform
        });

        if (existingAccount) {
            existingAccount.accessToken = mockTokenData.accessToken;
            existingAccount.refreshToken = mockTokenData.refreshToken;
            existingAccount.tokenExpiresAt = mockTokenData.expiresAt;
            existingAccount.isActive = true;
            await existingAccount.save();

            return res.json({
                success: true,
                data: {
                    accountId: existingAccount._id,
                    platform: existingAccount.platform,
                    username: existingAccount.username,
                    profilePicture: existingAccount.profileData.profilePicture,
                    permissions: existingAccount.permissions
                }
            });
        }

        const socialAccount = await SocialAccount.create({
            userId: req.user._id,
            platform,
            platformUserId: mockTokenData.platformUserId,
            username: mockTokenData.username,
            accessToken: mockTokenData.accessToken,
            refreshToken: mockTokenData.refreshToken,
            tokenExpiresAt: mockTokenData.expiresAt,
            profileData: mockTokenData.profileData,
            permissions: ['publish_content', 'read_insights']
        });

        res.status(201).json({
            success: true,
            data: {
                accountId: socialAccount._id,
                platform: socialAccount.platform,
                username: socialAccount.username,
                profilePicture: socialAccount.profileData.profilePicture,
                permissions: socialAccount.permissions
            }
        });
    } catch (error) {
        console.error('Connect account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while connecting account'
        });
    }
};

export const getConnectedAccounts = async (req, res) => {
    try {
        const accounts = await SocialAccount.find({ userId: req.user._id })
            .select('platform username profileData isActive createdAt')
            .sort({ createdAt: -1 });

        const formattedAccounts = accounts.map(account => ({
            id: account._id,
            platform: account.platform,
            username: account.username,
            profilePicture: account.profileData?.profilePicture,
            isActive: account.isActive,
            connectedAt: account.createdAt
        }));

        res.json({
            success: true,
            data: formattedAccounts
        });
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching accounts'
        });
    }
};

export const disconnectAccount = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await SocialAccount.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }

        account.isActive = false;
        await account.save();

        res.json({
            success: true,
            message: 'Account disconnected successfully'
        });
    } catch (error) {
        console.error('Disconnect account error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while disconnecting account'
        });
    }
};
