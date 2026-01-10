import express from 'express';
import multer from 'multer';
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

// Draft routes
router.post('/draft', upload.array('images', 10), createDraft);
router.get('/drafts', getDrafts);
router.get('/draft/:id', getDraftById);
router.patch('/draft/:id', updateDraft);
router.delete('/draft/:id', deleteDraft);

// Publish routes
router.post('/publish', publishPost);

// Published post routes
router.get('/published', getPublishedPosts);
router.get('/published/:id', getPublishedPostById);
router.delete('/published/:id', deletePublishedPost);

export default router;
