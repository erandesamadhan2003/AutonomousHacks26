import express from 'express';
import {
    connectAccount,
    getAccounts,
    getAccountById,
    disconnectAccount,
    refreshAccountData
} from '../controllers/socialAccount.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/connect', connectAccount);
router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.delete('/:id', disconnectAccount);
router.post('/:id/refresh', refreshAccountData);

export default router;
