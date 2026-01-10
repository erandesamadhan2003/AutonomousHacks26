import express from 'express';
import { connectAccount, disconnectAccount, getConnectedAccounts } from '../controllers/socialAccount.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/connect', authMiddleware, connectAccount);
router.get('/', authMiddleware, getConnectedAccounts);
router.delete('/:accountId', authMiddleware, disconnectAccount);

export default router;
