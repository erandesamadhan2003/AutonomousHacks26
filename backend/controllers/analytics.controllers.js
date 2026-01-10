import { PublishedPost } from "../models/PublishedPost.js";

export const getPostAnalytics = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await PublishedPost.findOne({
            _id: postId,
            userId: req.user._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: {
                postId: post._id,
                currentMetrics: post.metrics,
                metricsHistory: post.metricsHistory,
                performanceAnalysis: post.performanceAnalysis
            }
        });
    } catch (error) {
        console.error('Get post analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching analytics'
        });
    }
};

export const getAccountOverview = async (req, res) => {
    try {
        const { socialAccountId, period = '30d' } = req.query;

        if (!socialAccountId) {
            return res.status(400).json({
                success: false,
                message: 'Social account ID is required'
            });
        }

        const days = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const posts = await PublishedPost.find({
            userId: req.user._id,
            socialAccountId,
            publishedAt: { $gte: startDate }
        });

        const totalPosts = posts.length;
        const totalEngagement = posts.reduce((sum, post) =>
            sum + (post.metrics.likes + post.metrics.comments + post.metrics.shares), 0
        );
        const avgEngagementRate = posts.length > 0
            ? posts.reduce((sum, post) => sum + post.metrics.engagement_rate, 0) / posts.length
            : 0;

        const topPosts = posts
            .sort((a, b) => b.metrics.engagement_rate - a.metrics.engagement_rate)
            .slice(0, 5)
            .map(post => ({
                id: post._id,
                caption: post.caption,
                engagementRate: post.metrics.engagement_rate,
                publishedAt: post.publishedAt
            }));

        const hashtagCount = {};
        posts.forEach(post => {
            post.hashtags.forEach(tag => {
                hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
            });
        });

        const topHashtags = Object.entries(hashtagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);

        res.json({
            success: true,
            data: {
                totalPosts,
                totalEngagement,
                avgEngagementRate: avgEngagementRate.toFixed(2),
                topPosts,
                engagementTrend: posts.map(post => ({
                    date: post.publishedAt,
                    engagement: post.metrics.likes + post.metrics.comments
                })),
                bestPostingTimes: ['09:00', '18:00'], // TODO: Calculate from data
                topHashtags
            }
        });
    } catch (error) {
        console.error('Get account overview error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching overview'
        });
    }
};

export const refreshAnalytics = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await PublishedPost.findOne({
            _id: postId,
            userId: req.user._id
        });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // TODO: Queue job to fetch latest metrics from platform API
        post.lastMetricsUpdate = new Date();
        await post.save();

        res.json({
            success: true,
            message: 'Analytics refresh queued'
        });
    } catch (error) {
        console.error('Refresh analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while refreshing analytics'
        });
    }
};
