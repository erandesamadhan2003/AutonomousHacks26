import axios from 'axios';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v18.0';

export const publishImage = async (accessToken, imageUrl, caption) => {
    try {
        // Step 1: Create media container
        const containerResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media`, {
            image_url: imageUrl,
            caption: caption,
            access_token: accessToken
        });

        const creationId = containerResponse.data.id;

        // Step 2: Publish container
        const publishResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media_publish`, {
            creation_id: creationId,
            access_token: accessToken
        });

        return publishResponse.data.id;
    } catch (error) {
        console.error('Instagram publish image error:', error.response?.data || error);
        throw new Error('Failed to publish image to Instagram');
    }
};

export const publishCarousel = async (accessToken, imageUrls, caption) => {
    try {
        // Create containers for each image
        const containerIds = [];
        for (const imageUrl of imageUrls) {
            const response = await axios.post(`${INSTAGRAM_API_BASE}/me/media`, {
                image_url: imageUrl,
                is_carousel_item: true,
                access_token: accessToken
            });
            containerIds.push(response.data.id);
        }

        // Create carousel container
        const carouselResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media`, {
            media_type: 'CAROUSEL',
            children: containerIds,
            caption: caption,
            access_token: accessToken
        });

        // Publish carousel
        const publishResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media_publish`, {
            creation_id: carouselResponse.data.id,
            access_token: accessToken
        });

        return publishResponse.data.id;
    } catch (error) {
        console.error('Instagram publish carousel error:', error.response?.data || error);
        throw new Error('Failed to publish carousel to Instagram');
    }
};

export const publishReel = async (accessToken, videoUrl, caption) => {
    try {
        const containerResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media`, {
            media_type: 'REELS',
            video_url: videoUrl,
            caption: caption,
            share_to_feed: true,
            access_token: accessToken
        });

        const creationId = containerResponse.data.id;

        // Wait for video to be processed
        await new Promise(resolve => setTimeout(resolve, 5000));

        const publishResponse = await axios.post(`${INSTAGRAM_API_BASE}/me/media_publish`, {
            creation_id: creationId,
            access_token: accessToken
        });

        return publishResponse.data.id;
    } catch (error) {
        console.error('Instagram publish reel error:', error.response?.data || error);
        throw new Error('Failed to publish reel to Instagram');
    }
};

export const getPostMetrics = async (accessToken, mediaId) => {
    try {
        const response = await axios.get(`${INSTAGRAM_API_BASE}/${mediaId}`, {
            params: {
                fields: 'like_count,comments_count,media_type,timestamp',
                access_token: accessToken
            }
        });

        const insightsResponse = await axios.get(`${INSTAGRAM_API_BASE}/${mediaId}/insights`, {
            params: {
                metric: 'impressions,reach,engagement,saves',
                access_token: accessToken
            }
        });

        const metrics = {
            likes: response.data.like_count || 0,
            comments: response.data.comments_count || 0,
            impressions: 0,
            reach: 0,
            engagement: 0,
            saves: 0
        };

        insightsResponse.data.data.forEach(insight => {
            metrics[insight.name] = insight.values[0].value;
        });

        return metrics;
    } catch (error) {
        console.error('Instagram get metrics error:', error.response?.data || error);
        throw new Error('Failed to fetch Instagram metrics');
    }
};

export const getUserProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${INSTAGRAM_API_BASE}/me`, {
            params: {
                fields: 'id,username,account_type,media_count',
                access_token: accessToken
            }
        });

        return response.data;
    } catch (error) {
        console.error('Instagram get profile error:', error.response?.data || error);
        throw new Error('Failed to fetch Instagram profile');
    }
};

export const refreshAccessToken = async (account) => {
    try {
        const response = await axios.get(`${INSTAGRAM_API_BASE}/refresh_access_token`, {
            params: {
                grant_type: 'ig_refresh_token',
                access_token: account.refreshToken
            }
        });

        const expiresAt = new Date(Date.now() + response.data.expires_in * 1000);
        await account.updateTokens(response.data.access_token, null, expiresAt);

        return {
            accessToken: response.data.access_token,
            expiresIn: response.data.expires_in
        };
    } catch (error) {
        console.error('Instagram refresh token error:', error.response?.data || error);
        throw new Error('Failed to refresh Instagram token');
    }
};
