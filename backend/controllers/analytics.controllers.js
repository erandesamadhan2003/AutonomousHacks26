import { PublishedPost } from '../models/PublishedPost.js';
import { SocialAccount } from '../models/SocialAccount.js';
import { getInstagramPostMetrics, getLinkedInPostMetrics } from '../services/social.service.js';

// Get Overview
export const getOverview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { socialAccountId, period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const query = { userId, isDeleted: false, publishedAt: { $gte: startDate } };
        if (socialAccountId) query.socialAccountId = socialAccountId;

        const posts = await PublishedPost.find(query);

        const totalPosts = posts.length;
        const totalLikes = posts.reduce((sum, p) => sum + (p.metrics?.likes || 0), 0);
        const totalComments = posts.reduce((sum, p) => sum + (p.metrics?.comments || 0), 0);
        const totalShares = posts.reduce((sum, p) => sum + (p.metrics?.shares || 0), 0);
        const totalViews = posts.reduce((sum, p) => sum + (p.metrics?.views || 0), 0);
        const totalEngagement = totalLikes + totalComments + totalShares;
        const avgEngagementRate = totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(2) : 0;

        // Top posts
        const topPosts = posts
            .sort((a, b) => {
                const aEng = (a.metrics?.likes || 0) + (a.metrics?.comments || 0) + (a.metrics?.shares || 0);
                const bEng = (b.metrics?.likes || 0) + (b.metrics?.comments || 0) + (b.metrics?.shares || 0);
                return bEng - aEng;
            })
            .slice(0, 5);

        // Top hashtags
        const hashtagMap = {};
        posts.forEach(post => {
            post.hashtags?.forEach(tag => {
                if (!hashtagMap[tag]) {
                    hashtagMap[tag] = { count: 0, engagement: 0 };
                }
                hashtagMap[tag].count++;
                hashtagMap[tag].engagement += (post.metrics?.likes || 0) + (post.metrics?.comments || 0);
            });
        });

        const topHashtags = Object.entries(hashtagMap)
            .map(([tag, data]) => ({
                tag,
                count: data.count,
                avgEngagement: (data.engagement / data.count).toFixed(2)
            }))
            .sort((a, b) => b.avgEngagement - a.avgEngagement)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                totalPosts,
                totalEngagement,
                totalLikes,
                totalComments,
                totalShares,
                totalViews,
                avgEngagementRate,
                topPosts,
                topHashtags
            }
        });
    } catch (error) {
        console.error('Get overview error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch overview'
        });
    }
};

// Get Post Analytics
export const getPostAnalytics = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await PublishedPost.findOne({ _id: id, userId, isDeleted: false });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get post analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch post analytics'
        });
    }
};

// Refresh Post Metrics
export const refreshPostMetrics = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await PublishedPost.findOne({ _id: id, userId, isDeleted: false });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const account = await SocialAccount.findOne({
            userId,
            platform: post.platform,
            isDeleted: false
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Social account not found'
            });
        }

        let metrics;
        if (post.platform === 'instagram') {
            metrics = await getInstagramPostMetrics(account.accessToken, post.platformPostId);
        } else if (post.platform === 'linkedin') {
            metrics = await getLinkedInPostMetrics(account.accessToken, post.platformPostId);
        }

        // Update metrics
        post.metrics = metrics;
        post.metricsHistory.push({
            timestamp: new Date(),
            ...metrics
        });
        post.lastMetricsUpdate = new Date();

        await post.save();

        res.status(200).json({
            success: true,
            message: 'Metrics refreshed',
            data: {
                postId: post._id,
                metrics: post.metrics
            }
        });
    } catch (error) {
        console.error('Refresh metrics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to refresh metrics'
        });
    }
};

// Get Engagement Trend
export const getEngagementTrend = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId,
            isDeleted: false,
            publishedAt: { $gte: startDate }
        }).sort({ publishedAt: 1 });

        const trendData = {};
        posts.forEach(post => {
            const date = post.publishedAt.toISOString().split('T')[0];
            if (!trendData[date]) {
                trendData[date] = { likes: 0, comments: 0, shares: 0, views: 0, posts: 0 };
            }
            trendData[date].likes += post.metrics?.likes || 0;
            trendData[date].comments += post.metrics?.comments || 0;
            trendData[date].shares += post.metrics?.shares || 0;
            trendData[date].views += post.metrics?.views || 0;
            trendData[date].posts += 1;
        });

        const trend = Object.entries(trendData).map(([date, data]) => ({
            date,
            ...data,
            engagement: data.likes + data.comments + data.shares
        }));

        res.status(200).json({
            success: true,
            data: trend
        });
    } catch (error) {
        console.error('Get engagement trend error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch engagement trend'
        });
    }
};

// Get Top Posts
export const getTopPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 10, period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId,
            isDeleted: false,
            publishedAt: { $gte: startDate }
        });

        const sortedPosts = posts
            .map(post => ({
                ...post.toObject(),
                totalEngagement: (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0)
            }))
            .sort((a, b) => b.totalEngagement - a.totalEngagement)
            .slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            data: sortedPosts
        });
    } catch (error) {
        console.error('Get top posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch top posts'
        });
    }
};

// Get Hashtag Performance
export const getHashtagPerformance = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId,
            isDeleted: false,
            publishedAt: { $gte: startDate }
        });

        const hashtagStats = {};
        posts.forEach(post => {
            const engagement = (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0);
            post.hashtags?.forEach(tag => {
                if (!hashtagStats[tag]) {
                    hashtagStats[tag] = { count: 0, totalEngagement: 0, posts: [] };
                }
                hashtagStats[tag].count++;
                hashtagStats[tag].totalEngagement += engagement;
                hashtagStats[tag].posts.push(post._id);
            });
        });

        const performance = Object.entries(hashtagStats)
            .map(([tag, stats]) => ({
                tag,
                count: stats.count,
                avgEngagement: (stats.totalEngagement / stats.count).toFixed(2),
                totalEngagement: stats.totalEngagement
            }))
            .sort((a, b) => b.avgEngagement - a.avgEngagement);

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Get hashtag performance error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch hashtag performance'
        });
    }
};

// Get Best Posting Times
export const getBestPostingTimes = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId,
            isDeleted: false,
            publishedAt: { $gte: startDate }
        });

        const heatmap = {};
        for (let day = 0; day < 7; day++) {
            heatmap[day] = {};
            for (let hour = 0; hour < 24; hour++) {
                heatmap[day][hour] = { count: 0, engagement: 0 };
            }
        }

        posts.forEach(post => {
            const date = new Date(post.publishedAt);
            const day = date.getDay();
            const hour = date.getHours();
            const engagement = (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0);

            heatmap[day][hour].count++;
            heatmap[day][hour].engagement += engagement;
        });

        res.status(200).json({
            success: true,
            data: heatmap
        });
    } catch (error) {
        console.error('Get best posting times error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch best posting times'
        });
    }
};

// Get Insights
export const getInsights = async (req, res) => {
    try {
        const userId = req.user._id;
        const { period = '30d' } = req.query;

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId,
            isDeleted: false,
            publishedAt: { $gte: startDate }
        });

        const insights = [];

        // Average engagement rate
        const totalEngagement = posts.reduce((sum, p) =>
            sum + (p.metrics?.likes || 0) + (p.metrics?.comments || 0) + (p.metrics?.shares || 0), 0);
        const avgEngagement = posts.length > 0 ? (totalEngagement / posts.length).toFixed(2) : 0;

        insights.push({
            type: 'engagement',
            message: `Your average engagement per post is ${avgEngagement}`,
            value: avgEngagement
        });

        // Best platform
        const platformStats = {};
        posts.forEach(post => {
            if (!platformStats[post.platform]) {
                platformStats[post.platform] = { count: 0, engagement: 0 };
            }
            platformStats[post.platform].count++;
            platformStats[post.platform].engagement += (post.metrics?.likes || 0) + (post.metrics?.comments || 0);
        });

        const bestPlatform = Object.entries(platformStats)
            .sort((a, b) => (b[1].engagement / b[1].count) - (a[1].engagement / a[1].count))[0];

        if (bestPlatform) {
            insights.push({
                type: 'platform',
                message: `${bestPlatform[0]} performs best with avg ${(bestPlatform[1].engagement / bestPlatform[1].count).toFixed(2)} engagement`,
                platform: bestPlatform[0]
            });
        }

        res.status(200).json({
            success: true,
            data: insights
        });
    } catch (error) {
        console.error('Get insights error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate insights'
        });
    }
};
