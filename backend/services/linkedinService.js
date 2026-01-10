import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

export const publishPost = async (accessToken, personUrn, text, mediaUrls = []) => {
    try {
        const shareData = {
            author: personUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: text
                    },
                    shareMediaCategory: mediaUrls.length > 0 ? 'IMAGE' : 'NONE'
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        if (mediaUrls.length > 0) {
            shareData.specificContent['com.linkedin.ugc.ShareContent'].media = mediaUrls.map(url => ({
                status: 'READY',
                media: url
            }));
        }

        const response = await axios.post(`${LINKEDIN_API_BASE}/ugcPosts`, shareData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        return response.data.id;
    } catch (error) {
        console.error('LinkedIn publish error:', error.response?.data || error);
        throw new Error('Failed to publish to LinkedIn');
    }
};

export const getPostAnalytics = async (accessToken, shareUrn) => {
    try {
        const response = await axios.get(`${LINKEDIN_API_BASE}/socialActions/${shareUrn}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return {
            likes: response.data.likesSummary?.totalLikes || 0,
            comments: response.data.commentsSummary?.totalComments || 0,
            shares: response.data.sharesSummary?.totalShares || 0
        };
    } catch (error) {
        console.error('LinkedIn analytics error:', error.response?.data || error);
        throw new Error('Failed to fetch LinkedIn analytics');
    }
};

export const getUserProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${LINKEDIN_API_BASE}/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('LinkedIn profile error:', error.response?.data || error);
        throw new Error('Failed to fetch LinkedIn profile');
    }
};

export const refreshAccessToken = async (account, clientId, clientSecret) => {
    try {
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
            grant_type: 'refresh_token',
            refresh_token: account.refreshToken,
            client_id: clientId,
            client_secret: clientSecret
        });

        const expiresAt = new Date(Date.now() + response.data.expires_in * 1000);
        await account.updateTokens(response.data.access_token, response.data.refresh_token, expiresAt);

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in
        };
    } catch (error) {
        console.error('LinkedIn refresh token error:', error.response?.data || error);
        throw new Error('Failed to refresh LinkedIn token');
    }
};
