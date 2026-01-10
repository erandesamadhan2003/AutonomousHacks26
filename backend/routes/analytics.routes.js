import express from 'express';
import {
    getOverview,
    getPostAnalytics,
    refreshPostMetrics,
    getEngagementTrend,
    getTopPosts,
    getHashtagPerformance,
    getBestPostingTimes,
    getInsights
} from '../controllers/analytics.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/overview', getOverview);
router.get('/post/:id', getPostAnalytics);
router.post('/refresh/:id', refreshPostMetrics);
router.get('/engagement-trend', getEngagementTrend);
router.get('/top-posts', getTopPosts);
router.get('/hashtags', getHashtagPerformance);
router.get('/best-times', getBestPostingTimes);
router.get('/insights', getInsights);

export default router;
