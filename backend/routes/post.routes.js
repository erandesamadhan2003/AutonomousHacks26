import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed.`));
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
    console.log(`${'='.repeat(80)}\n`);
    next();
});

// Draft routes with detailed logging after multer processes the request
router.post('/draft',
    upload.array('images', 10),
    (req, res, next) => {
        console.log('📝 Request Processed by Multer:');
        console.log(`   Caption: ${req.body?.caption || 'Not provided'}`);
        console.log(`   Platforms: ${req.body?.platforms || 'Not provided'}`);
        console.log(`   Hashtags: ${req.body?.hashtags || 'Not provided'}`);
        console.log(`   Files: ${req.files?.length || 0}`);

        if (req.files && req.files.length > 0) {
            req.files.forEach((file, idx) => {
                console.log(`   File ${idx + 1}: ${file.originalname} (${(file.size / 1024).toFixed(2)} KB)`);
            });
        }
        console.log('');
        next();
    },
    createDraft
);

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
