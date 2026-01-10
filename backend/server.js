import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import socialAccountRoutes from './routes/socialAccount.routes.js';
import postRoutes from './routes/post.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import preferencesRoutes from './routes/preferences.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { configurePassport } from './config/passport.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { startAnalyticsRefreshJob } from './jobs/analyticsRefreshJob.js';
import { startScheduledPostJob } from './jobs/scheduledPostJob.js';
import logger from './utils/logger.js';
import fs from 'fs';

dotenv.config();

// Create necessary directories
['uploads', 'logs'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

connectDB();
connectRedis();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Apply general rate limiter to all routes
app.use(generalLimiter);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/social-accounts', socialAccountRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Social Media Automation Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        googleAuth: 'GET /api/auth/google',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout'
      },
      socialAccounts: {
        connect: 'POST /api/social-accounts/connect',
        getAll: 'GET /api/social-accounts',
        disconnect: 'DELETE /api/social-accounts/:accountId'
      },
      posts: {
        createDraft: 'POST /api/posts/draft',
        getDraftStatus: 'GET /api/posts/draft/:draftId',
        updateDraft: 'PATCH /api/posts/draft/:draftId',
        getAllDrafts: 'GET /api/posts/drafts',
        publish: 'POST /api/posts/publish',
        getPublished: 'GET /api/posts/published'
      },
      analytics: {
        postAnalytics: 'GET /api/analytics/post/:postId',
        overview: 'GET /api/analytics/overview',
        refresh: 'POST /api/analytics/refresh/:postId'
      },
      preferences: {
        get: 'GET /api/preferences',
        update: 'PATCH /api/preferences'
      },
      dashboard: {
        overview: 'GET /api/dashboard/overview'
      },
    }
  });
});

// Start cron jobs
if (process.env.NODE_ENV !== 'test') {
  startAnalyticsRefreshJob();
  startScheduledPostJob();
  logger.info('Cron jobs started');
}

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Server started on port ${PORT}`);
});