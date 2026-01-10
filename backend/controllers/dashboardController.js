import { SocialAccount } from '../models/SocialAccount.js';
import { DraftPost } from '../models/DraftPost.js';
import { PublishedPost } from '../models/PublishedPost.js';
import logger from '../utils/logger.js';

const parsePeriodDays = (period = '30d') => {
    const map = { '7d': 7, '30d': 30, '90d': 90 };
    return map[period] || 30;
};

const percentChange = (current = 0, previous = 0) => {
    if (!previous) return current ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
};

// 1. getDashboardOverview
export const getDashboardOverview = async (req, res) => {
    try {
        const userId = req.user?._id;
        const days = parsePeriodDays(req.query.period);
        const now = new Date();
        const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
        const prevEnd = start;

        // Current period aggregation
        const [currentAgg] = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: start, $lte: now } } },
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    likes: { $sum: { $ifNull: ['$metrics.likes', 0] } },
                    comments: { $sum: { $ifNull: ['$metrics.comments', 0] } },
                    shares: { $sum: { $ifNull: ['$metrics.shares', 0] } },
                    views: { $sum: { $ifNull: ['$metrics.views', 0] } },
                },
            },
        ]);

        // Previous period aggregation
        const [prevAgg] = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: prevStart, $lte: prevEnd } } },
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    likes: { $sum: { $ifNull: ['$metrics.likes', 0] } },
                    comments: { $sum: { $ifNull: ['$metrics.comments', 0] } },
                    shares: { $sum: { $ifNull: ['$metrics.shares', 0] } },
                    views: { $sum: { $ifNull: ['$metrics.views', 0] } },
                },
            },
        ]);

        const totalEngagement =
            (currentAgg?.likes || 0) +
            (currentAgg?.comments || 0) +
            (currentAgg?.shares || 0) +
            (currentAgg?.views || 0);

        const prevTotalEngagement =
            (prevAgg?.likes || 0) +
            (prevAgg?.comments || 0) +
            (prevAgg?.shares || 0) +
            (prevAgg?.views || 0);

        // Average engagement rate calculation
        const [rateAgg] = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: start, $lte: now } } },
            {
                $project: {
                    views: { $ifNull: ['$metrics.views', 0] },
                    engagement: {
                        $add: [
                            { $ifNull: ['$metrics.likes', 0] },
                            { $ifNull: ['$metrics.comments', 0] },
                            { $ifNull: ['$metrics.shares', 0] },
                        ],
                    },
                },
            },
            {
                $project: {
                    rate: {
                        $cond: [
                            { $gt: ['$views', 0] },
                            { $multiply: [{ $divide: ['$engagement', '$views'] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $group: { _id: null, avgRate: { $avg: '$rate' } } },
        ]);

        const [prevRateAgg] = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: prevStart, $lte: prevEnd } } },
            {
                $project: {
                    views: { $ifNull: ['$metrics.views', 0] },
                    engagement: {
                        $add: [
                            { $ifNull: ['$metrics.likes', 0] },
                            { $ifNull: ['$metrics.comments', 0] },
                            { $ifNull: ['$metrics.shares', 0] },
                        ],
                    },
                },
            },
            {
                $project: {
                    rate: {
                        $cond: [
                            { $gt: ['$views', 0] },
                            { $multiply: [{ $divide: ['$engagement', '$views'] }, 100] },
                            0,
                        ],
                    },
                },
            },
            { $group: { _id: null, avgRate: { $avg: '$rate' } } },
        ]);

        const connectedAccounts = await SocialAccount.countDocuments({
            user: userId,
            isActive: true,
        });

        const stats = {
            totalPosts: currentAgg?.totalPosts || 0,
            totalEngagement,
            connectedAccounts,
            avgEngagementRate: Number((rateAgg?.[0]?.avgRate || 0).toFixed(2)),
            changes: {
                posts: percentChange(currentAgg?.totalPosts || 0, prevAgg?.totalPosts || 0),
                engagement: percentChange(totalEngagement, prevTotalEngagement),
                avgRate: percentChange(rateAgg?.[0]?.avgRate || 0, prevRateAgg?.[0]?.avgRate || 0),
            },
        };

        return res.status(200).json({ success: true, data: { stats } });
    } catch (err) {
        logger.error('getDashboardOverview error', { error: err.message });
        return res
            .status(500)
            .json({ success: false, message: 'Failed to load dashboard overview' });
    }
};

// 2. getRecentActivity
export const getRecentActivity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const limit = Number(req.query.limit) || 10;

        const published = await PublishedPost.find({ user: userId })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .select('caption platform publishedAt thumbnail')
            .lean();

        const drafts = await DraftPost.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('caption createdAt')
            .lean();

        const accounts = await SocialAccount.find({ user: userId })
            .sort({ connectedAt: -1 })
            .limit(limit)
            .select('platform username connectedAt')
            .lean();

        const activities = [
            ...published.map((p) => ({
                type: 'post_published',
                title: 'Post Published',
                description: `Published on ${p.platform}`,
                time: p.publishedAt,
                metadata: { caption: p.caption, thumbnail: p.thumbnail, platform: p.platform },
            })),
            ...drafts.map((d) => ({
                type: 'draft_created',
                title: 'Draft Created',
                description: 'New draft saved',
                time: d.createdAt,
                metadata: { caption: d.caption },
            })),
            ...accounts.map((a) => ({
                type: 'account_connected',
                title: 'Account Connected',
                description: `Connected ${a.platform}`,
                time: a.connectedAt,
                metadata: { platform: a.platform, username: a.username },
            })),
        ]
            .filter((a) => a.time)
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, limit);

        return res.status(200).json({ success: true, data: activities });
    } catch (err) {
        logger.error('getRecentActivity error', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to load recent activity' });
    }
};

// 3. getQuickStats
export const getQuickStats = async (req, res) => {
    try {
        const userId = req.user?._id;
        const startWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const postsThisWeek = await PublishedPost.countDocuments({
            user: userId,
            publishedAt: { $gte: startWeek },
        });

        const draftsPending = await DraftPost.countDocuments({
            user: userId,
            $or: [{ status: 'pending' }, { status: 'draft' }, { isDraft: true }],
        });

        const scheduledPosts = await PublishedPost.countDocuments({
            user: userId,
            status: 'scheduled',
            scheduledAt: { $gte: new Date() },
        });

        const processingPosts = await PublishedPost.countDocuments({
            user: userId,
            status: 'processing',
        });

        return res.status(200).json({
            success: true,
            data: { postsThisWeek, draftsPending, scheduledPosts, processingPosts },
        });
    } catch (err) {
        logger.error('getQuickStats error', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to load quick stats' });
    }
};

// 4. getTopPerformingPosts
export const getTopPerformingPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        const limit = Number(req.query.limit) || 6;
        const days = parsePeriodDays(req.query.period || '30d');
        const now = new Date();
        const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const posts = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: start, $lte: now } } },
            {
                $project: {
                    caption: 1,
                    thumbnail: 1,
                    platform: 1,
                    publishedAt: 1,
                    likes: { $ifNull: ['$metrics.likes', 0] },
                    comments: { $ifNull: ['$metrics.comments', 0] },
                    shares: { $ifNull: ['$metrics.shares', 0] },
                    views: { $ifNull: ['$metrics.views', 0] },
                },
            },
            {
                $addFields: {
                    engagement: { $add: ['$likes', '$comments', '$shares'] },
                    engagementRate: {
                        $cond: [
                            { $gt: ['$views', 0] },
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $add: ['$likes', '$comments', '$shares'] },
                                            '$views',
                                        ],
                                    },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                },
            },
            { $sort: { engagementRate: -1 } },
            { $limit: limit },
            {
                $project: {
                    postId: '$_id',
                    caption: 1,
                    thumbnail: 1,
                    platform: 1,
                    publishedAt: 1,
                    metrics: {
                        likes: '$likes',
                        comments: '$comments',
                        shares: '$shares',
                        views: '$views',
                        engagement: '$engagement',
                        engagementRate: { $round: ['$engagementRate', 2] },
                    },
                    _id: 0,
                },
            },
        ]);

        return res.status(200).json({ success: true, data: posts });
    } catch (err) {
        logger.error('getTopPerformingPosts error', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to load top posts' });
    }
};

// 5. getEngagementChart
export const getEngagementChart = async (req, res) => {
    try {
        const userId = req.user?._id;
        const days = parsePeriodDays(req.query.period || '30d');
        const now = new Date();
        const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        const daily = await PublishedPost.aggregate([
            { $match: { user: userId, publishedAt: { $gte: start, $lte: now } } },
            {
                $project: {
                    day: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
                    likes: { $ifNull: ['$metrics.likes', 0] },
                    comments: { $ifNull: ['$metrics.comments', 0] },
                    shares: { $ifNull: ['$metrics.shares', 0] },
                    views: { $ifNull: ['$metrics.views', 0] },
                },
            },
            {
                $group: {
                    _id: '$day',
                    likes: { $sum: '$likes' },
                    comments: { $sum: '$comments' },
                    shares: { $sum: '$shares' },
                    views: { $sum: '$views' },
                },
            },
            {
                $project: {
                    date: '$_id',
                    likes: 1,
                    comments: 1,
                    shares: 1,
                    views: 1,
                    totalEngagement: { $add: ['$likes', '$comments', '$shares', '$views'] },
                    _id: 0,
                },
            },
            { $sort: { date: 1 } },
        ]);

        return res.status(200).json({ success: true, data: daily });
    } catch (err) {
        logger.error('getEngagementChart error', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to load engagement chart' });
    }
};

// 6. getConnectedAccountsOverview
export const getConnectedAccountsOverview = async (req, res) => {
    try {
        const userId = req.user?._id;

        const accounts = await SocialAccount.aggregate([
            { $match: { user: userId } },
            {
                $lookup: {
                    from: 'publishedposts',
                    let: { accountId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$socialAccount', '$$accountId'] } } },
                        { $count: 'postCount' },
                    ],
                    as: 'postStats',
                },
            },
            {
                $project: {
                    platform: 1,
                    username: 1,
                    profilePicture: 1,
                    followerCount: { $ifNull: ['$metrics.followerCount', 0] },
                    isActive: 1,
                    lastSynced: 1,
                    postCount: { $arrayElemAt: ['$postStats.postCount', 0] },
                    _id: 0,
                },
            },
            { $sort: { platform: 1 } },
        ]);

        return res.status(200).json({ success: true, data: accounts });
    } catch (err) {
        logger.error('getConnectedAccountsOverview error', { error: err.message });
        return res
            .status(500)
            .json({ success: false, message: 'Failed to load connected accounts' });
    }
};
