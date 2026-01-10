import express from 'express';
import {
    getPreferences,
    updatePreferences
} from '../controllers/preferences.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', getPreferences);
router.patch('/', updatePreferences);

export default router;
