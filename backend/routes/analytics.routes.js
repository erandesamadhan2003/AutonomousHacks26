import express from 'express';
import { getAccountOverview, getPostAnalytics, refreshAnalytics } from '../controllers/analytics.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/post/:postId', authMiddleware, getPostAnalytics);
router.get('/overview', authMiddleware, getAccountOverview);
router.post('/refresh/:postId', authMiddleware, refreshAnalytics);

export default router;
