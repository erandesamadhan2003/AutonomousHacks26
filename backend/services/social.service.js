import axios from 'axios';
import { SocialAccount } from '../models/SocialAccount.js';

const INSTAGRAM_API_URL = 'https://graph.instagram.com';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

// Instagram Services
export const exchangeInstagramCode = async (code, redirectUri) => {
    try {
        const response = await axios.post('https://api.instagram.com/oauth/access_token', {
            client_id: process.env.INSTAGRAM_CLIENT_ID,
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code
        });

        return response.data;
    } catch (error) {
        console.error('Instagram code exchange error:', error);
        throw error;
    }
};

export const getInstagramProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${INSTAGRAM_API_URL}/me`, {
            params: {
                fields: 'id,username,account_type,media_count',
                access_token: accessToken
            }
        });

        return {
            id: response.data.id,
            username: response.data.username,
            accountType: response.data.account_type,
            mediaCount: response.data.media_count
        };
    } catch (error) {
        console.error('Get Instagram profile error:', error);
        throw error;
    }
};

export const publishToInstagram = async (userId, postData) => {
    try {
        const account = await SocialAccount.findOne({
            userId,
            platform: 'instagram',
            connected: true,
            isDeleted: false
        });

        if (!account) {
            throw new Error('Instagram account not connected');
        }

        // Create media container
        const containerResponse = await axios.post(
            `${INSTAGRAM_API_URL}/${account.platformUserId}/media`,
            {
                image_url: postData.images[0]?.url,
                caption: postData.caption,
                access_token: account.accessToken
            }
        );

        const containerId = containerResponse.data.id;

        // Publish container
        const publishResponse = await axios.post(
            `${INSTAGRAM_API_URL}/${account.platformUserId}/media_publish`,
            {
                creation_id: containerId,
                access_token: account.accessToken
            }
        );

        return {
            success: true,
            postId: publishResponse.data.id,
            url: `https://www.instagram.com/p/${publishResponse.data.id}`
        };
    } catch (error) {
        console.error('Publish to Instagram error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const getInstagramPostMetrics = async (accessToken, postId) => {
    try {
        const response = await axios.get(`${INSTAGRAM_API_URL}/${postId}`, {
            params: {
                fields: 'like_count,comments_count,timestamp',
                access_token: accessToken
            }
        });

        return {
            likes: response.data.like_count || 0,
            comments: response.data.comments_count || 0,
            shares: 0,
            views: 0,
            timestamp: response.data.timestamp
        };
    } catch (error) {
        console.error('Get Instagram metrics error:', error);
        throw error;
    }
};

// LinkedIn Services
export const exchangeLinkedInCode = async (code, redirectUri) => {
    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }
        });

        return response.data;
    } catch (error) {
        console.error('LinkedIn code exchange error:', error);
        throw error;
    }
};

export const getLinkedInProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${LINKEDIN_API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return {
            id: response.data.id,
            name: `${response.data.localizedFirstName} ${response.data.localizedLastName}`,
            username: response.data.id
        };
    } catch (error) {
        console.error('Get LinkedIn profile error:', error);
        throw error;
    }
};

export const publishToLinkedIn = async (userId, postData) => {
    try {
        const account = await SocialAccount.findOne({
            userId,
            platform: 'linkedin',
            connected: true,
            isDeleted: false
        });

        if (!account) {
            throw new Error('LinkedIn account not connected');
        }

        const response = await axios.post(
            `${LINKEDIN_API_URL}/ugcPosts`,
            {
                author: `urn:li:person:${account.platformUserId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: postData.caption
                        },
                        shareMediaCategory: 'IMAGE',
                        media: postData.images.map(img => ({
                            status: 'READY',
                            media: img.url
                        }))
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${account.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            success: true,
            postId: response.data.id,
            url: `https://www.linkedin.com/feed/update/${response.data.id}`
        };
    } catch (error) {
        console.error('Publish to LinkedIn error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

export const getLinkedInPostMetrics = async (accessToken, postId) => {
    try {
        const response = await axios.get(
            `${LINKEDIN_API_URL}/socialActions/${postId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        return {
            likes: response.data.likesSummary?.totalLikes || 0,
            comments: response.data.commentsSummary?.totalComments || 0,
            shares: response.data.sharesSummary?.totalShares || 0,
            views: response.data.impressionCount || 0
        };
    } catch (error) {
        console.error('Get LinkedIn metrics error:', error);
        throw error;
    }
};
