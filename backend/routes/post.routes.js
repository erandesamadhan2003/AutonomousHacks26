import express from 'express';
import multer from 'multer';
import { DraftPost } from '../models/DraftPost.js';
import {
    createDraft,
    getDrafts,
    getDraftById,
    updateDraft,
    deleteDraft,
    publishPost,
    getPublishedPosts,
    getPublishedPostById,
    deletePublishedPost
} from '../controllers/post.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'));
        }
    }
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// Logging middleware for all post routes
router.use((req, res, next) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📍 POST ROUTE: ${req.method} ${req.path}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`👤 User ID: ${req.user?._id || 'Not authenticated'}`);
    console.log(`📦 Body:`, Object.keys(req.body).length > 0 ? req.body : 'Empty');
    console.log(`📁 Files:`, req.files?.length || 0);
    console.log(`${'='.repeat(80)}\n`);
    next();
});

// Draft routes
router.post('/draft', upload.array('images', 10), createDraft);
router.get('/drafts', getDrafts);
router.get('/draft/:id', getDraftById);

// Get video URL from draft
router.get('/draft/:id/video', async (req, res) => {
    try {
        console.log(`📹 Fetching video for draft: ${req.params.id}`);

        const draft = await DraftPost.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!draft || !draft.aiGeneratedVideo) {
            console.log('❌ Video not found');
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        console.log('✓ Video found and returned');
        res.status(200).json({
            success: true,
            video: {
                url: draft.aiGeneratedVideo.url,
                format: draft.aiGeneratedVideo.format,
                size: draft.aiGeneratedVideo.size,
                generatedAt: draft.aiGeneratedVideo.generatedAt
            }
        });
    } catch (error) {
        console.error('❌ Error fetching video:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/draft/:id', updateDraft);
router.delete('/draft/:id', deleteDraft);

// Publish routes
router.post('/publish', publishPost);

// Published post routes
router.get('/published', getPublishedPosts);
router.get('/published/:id', getPublishedPostById);
router.delete('/published/:id', deletePublishedPost);

export default router;
