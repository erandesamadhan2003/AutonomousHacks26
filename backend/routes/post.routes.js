import express from 'express';
import { createDraft, getAllDrafts, getDraftStatus, getPublishedPosts, publishPost, updateDraft } from '../controllers/post.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/draft', authMiddleware, upload.array('images', 10), createDraft);
router.get('/draft/:draftId', authMiddleware, getDraftStatus);
router.patch('/draft/:draftId', authMiddleware, updateDraft);
router.get('/drafts', authMiddleware, getAllDrafts);
router.post('/publish', authMiddleware, publishPost);
router.get('/published', authMiddleware, getPublishedPosts);

export default router;
