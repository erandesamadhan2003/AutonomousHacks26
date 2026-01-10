import rateLimit from 'express-rate-limit';
import { RATE_LIMITS } from '../config/constants.js';

export const generalLimiter = rateLimit({
    windowMs: RATE_LIMITS.GENERAL.windowMs,
    max: RATE_LIMITS.GENERAL.max,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});

export const authLimiter = rateLimit({
    windowMs: RATE_LIMITS.AUTH.windowMs,
    max: RATE_LIMITS.AUTH.max,
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});

export const uploadLimiter = rateLimit({
    windowMs: RATE_LIMITS.UPLOAD.windowMs,
    max: RATE_LIMITS.UPLOAD.max,
    message: 'Too many uploads, please try again later',
    standardHeaders: true,
    legacyHeaders: false
});
