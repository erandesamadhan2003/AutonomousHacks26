import express from 'express';
import { getPreferences, updatePreferences } from '../controllers/preferences.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getPreferences);
router.patch('/', authMiddleware, updatePreferences);

export default router;
