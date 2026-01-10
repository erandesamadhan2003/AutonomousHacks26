import express from 'express';
import {
    getDashboardOverview,
    getRecentActivity,
    getQuickStats,
    getTopPerformingPosts,
    getEngagementChart,
    getConnectedAccountsOverview,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/overview', getDashboardOverview);
router.get('/recent-activity', getRecentActivity);
router.get('/quick-stats', getQuickStats);
router.get('/top-posts', getTopPerformingPosts);
router.get('/engagement-chart', getEngagementChart);
router.get('/connected-accounts', getConnectedAccountsOverview);

export default router;
