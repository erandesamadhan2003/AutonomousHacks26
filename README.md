# AutonomousHacks26

` GET /api/social-accounts/:id` → `socialAccountController.getAccountById`
  - `DELETE /api/social-accounts/:id` → `socialAccountController.disconnectAccount`
  - `POST /api/social-accounts/:id/refresh` → `socialAccountController.refreshAccountData`

#### `draftRoutes.js`
- **Endpoints** (all protected):
  - `POST /api/posts/draft` → `draftController.createDraft` (with file upload middleware)
  - `GET /api/posts/drafts` → `draftController.getDrafts`
  - `GET /api/posts/draft/:id` → `draftController.getDraftById`
  - `PATCH /api/posts/draft/:id` → `draftController.updateDraft`
  - `DELETE /api/posts/draft/:id` → `draftController.deleteDraft`

#### `publishRoutes.js`
- **Endpoints** (all protected):
  - `POST /api/posts/publish` → `publishController.publishPost`
  - `GET /api/posts/published` → `publishController.getPublishedPosts`
  - `GET /api/posts/published/:id` → `publishController.getPublishedPostById`
  - `DELETE /api/posts/published/:id` → `publishController.deletePublishedPost`

#### `analyticsRoutes.js`
- **Endpoints** (all protected):
  - `GET /api/analytics/overview` → `analyticsController.getOverview`
  - `GET /api/analytics/post/:id` → `analyticsController.getPostAnalytics`
  - `POST /api/analytics/refresh/:id` → `analyticsController.refreshPostMetrics`
  - `GET /api/analytics/trends` → `analyticsController.getTrends`
  - `GET /api/analytics/hashtags` → `analyticsController.getHashtagPerformance`

#### `preferencesRoutes.js`
- **Endpoints** (all protected):
  - `GET /api/preferences` → `preferencesController.getPreferences`
  - `PATCH /api/preferences` → `preferencesController.updatePreferences`

---

### **Middleware (src/middleware/)**

#### `auth.js`
- **Purpose**: JWT authentication middleware
- **Functions**:
  - `protect()` - Verify JWT token, attach user to req.user
  - `restrictTo(...roles)` - Check user roles/permissions

#### `errorHandler.js`
- **Purpose**: Global error handling
- **Functions**:
  - `notFound()` - Handle 404 errors
  - `errorHandler()` - Catch all errors, send appropriate response
  - Error logging

#### `validation.js`
- **Purpose**: Request validation using express-validator
- **Functions**:
  - `validateRegister()` - Validate registration input
  - `validateLogin()` - Validate login input
  - `validateDraft()` - Validate draft creation
  - `validatePublish()` - Validate publish request

#### `upload.js`
- **Purpose**: File upload handling using Multer
- **Configuration**:
  - Storage: diskStorage or memoryStorage
  - File filter: accept only images/videos
  - Size limits
  - Multiple file support
- **Exports**:
  - `upload.array('images', 10)` - For draft creation

#### `rateLimiter.js`
- **Purpose**: Rate limiting to prevent abuse
- **Configuration**:
  - Different limits for different endpoints
  - Window duration
  - Error messages

---

### **Services (src/services/)**

#### `agentService.js`
- **Purpose**: Communicate with Python agents
- **Functions**:
  - `processImagesWithAgent()` - Call Image Processing Agent
    - Send POST request to http://localhost:5001/process-images
    - Handle response/errors
    - Return processed images
  
  - `generateCaptionsWithAgent()` - Call Caption Generation Agent
    - Send POST to http://localhost:5002/generate-captions
    - Return generated captions + hashtags
  
  - `generateVideoWithAgent()` - Call Video Generation Agent
    - Send POST to http://localhost:5003/generate-video
    - Return video URL
  
  - `suggestMusicWithAgent()` - Call Music Suggestion Agent
    - Send POST to http://localhost:5004/suggest-music
    - Return music suggestions
  
  - `processAllAgents()` - Orchestrate all agents
    - Call all 4 agents in parallel (Promise.all)
    - Update DraftPost with results
    - Handle partial failures
    - Return consolidated results

#### `instagramService.js`
- **Purpose**: Instagram Graph API integration
- **Functions**:
  - `publishImage()` - Post image to Instagram
  - `publishCarousel()` - Post multiple images
  - `publishReel()` - Post video/reel
  - `getPostMetrics()` - Fetch engagement metrics
  - `getUserProfile()` - Get profile data
  - `refreshAccessToken()` - Refresh OAuth token

#### `linkedinService.js`
- **Purpose**: LinkedIn API integration
- **Functions**:
  - `publishPost()` - Share post on LinkedIn
  - `getPostAnalytics()` - Fetch post metrics
  - `getUserProfile()` - Get profile data
  - `refreshAccessToken()` - Refresh OAuth token

#### `fileService.js`
- **Purpose**: File management
- **Functions**:
  - `uploadToCloudinary()` - Upload files to cloud storage
  - `deleteFromCloudinary()` - Delete files
  - `generateThumbnail()` - Create video thumbnails
  - `validateFile()` - Check file type/size
  - `getFileUrl()` - Get public URL

#### `queueService.js`
- **Purpose**: Job queue management (using Bull/BullMQ)
- **Functions**:
  - `addAgentJob()` - Add job to queue
  - `processAgentJobs()` - Process jobs from queue
  - `retryFailedJob()` - Retry failed jobs
  - `getJobStatus()` - Check job status

#### `emailService.js`
- **Purpose**: Send emails (using Nodemailer)
- **Functions**:
  - `sendWelcomeEmail()` - Send welcome email
  - `sendPostPublishedNotification()` - Notify on publish
  - `sendWeeklyReport()` - Send analytics report

---

### **Utils (src/utils/)**

#### `jwt.js`
- **Functions**:
  - `generateToken(userId)` - Create JWT token
  - `verifyToken(token)` - Verify and decode token

#### `validators.js`
- **Functions**:
  - Email validation
  - Password strength check
  - File validation helpers

#### `helpers.js`
- **Functions**:
  - Generic utility functions
  - Date/time helpers
  - String manipulation

#### `logger.js`
- **Purpose**: Application logging (using Winston)
- **Configuration**:
  - Log to console and files
  - Different log levels (info, warn, error)
  - Separate error log file

---

### **Jobs (src/jobs/)**

#### `analyticsRefreshJob.js`
- **Purpose**: Periodically refresh post metrics
- **Schedule**: Every 6 hours (using node-cron)
- **Logic**:
  - Fetch posts from last 7 days
  - Call Instagram/LinkedIn API for each post
  - Update metrics in database
  - Trigger performance analysis

#### `scheduledPostJob.js`
- **Purpose**: Publish scheduled posts
- **Schedule**: Every 5 minutes
- **Logic**:
  - Find drafts with `scheduledAt <= now`
  - Publish to platform
  - Update status
  - Handle errors

#### `cleanupJob.js`
- **Purpose**: Clean up old data
- **Schedule**: Daily at midnight
- **Logic**:
  - Delete old draft files
  - Archive old analytics data
  - Clean up expired tokens

---

# 🐍 PYTHON AGENTS STRUCTURE

```
agents/
├── agent1_image_processing/
│   ├── app.py
│   ├── processor.py
│   ├── requirements.txt
│   └── .env
│
├── agent2_caption_generation/
│   ├── app.py
│   ├── generator.py
│   ├── requirements.txt
│   └── .env
│
├── agent3_video_generation/
│   ├── app.py
│   ├── video_maker.py
│   ├── requirements.txt
│   └── .env
│
├── agent4_music_suggestion/
│   ├── app.py
│   ├── suggester.py
│   ├── requirements.txt
│   └── .env
│
└── shared/
    ├── utils.py
    └── config.py
```

---

## 📋 AGENTS FILE DETAILS

### **Agent 1: Image Processing**

#### `app.py`
- **Purpose**: Flask/FastAPI server
- **Endpoint**: `POST /process-images`
- **Input**: JSON with images (base64 or URLs)
- **Output**: Processed images with variants
- **Port**: 5001

#### `processor.py`
- **Purpose**: Image processing logic
- **Functions**:
  - `enhance_image()` - Improve quality (brightness, contrast, sharpness)
  - `apply_filters()` - Apply Instagram-style filters
  - `generate_variants()` - Create multiple versions
  - `resize_for_platform()` - Optimize for Instagram/LinkedIn specs
- **Libraries**: PIL/Pillow, OpenCV, numpy

---

### **Agent 2: Caption Generation**

#### `app.py`
- **Endpoint**: `POST /generate-captions`
- **Input**: Images, description, brand voice, platform
- **Output**: Multiple caption options with hashtags
- **Port**: 5002

#### `generator.py`
- **Functions**:
  - `analyze_image_content()` - Describe image content
  - `generate_captions()` - Create captions using OpenAI/Gemini
  - `suggest_hashtags()` - Research and suggest relevant hashtags
  - `score_caption()` - Score caption quality
- **Libraries**: openai/google-generativeai, nltk

---

### **Agent 3: Video Generation**

#### `app.py`
- **Endpoint**: `POST /generate-video`
- **Input**: Images, transition style, duration, music
- **Output**: Video file URL
- **Port**: 5003

#### `video_maker.py`
- **Functions**:
  - `create_slideshow()` - Combine images into video
  - `add_transitions()` - Apply transitions between images
  - `add_effects()` - Zoom, pan effects (Ken Burns)
  - `add_background_music()` - Overlay audio
  - `export_video()` - Render and upload
- **Libraries**: moviepy, ffmpeg

---

### **Agent 4: Music Suggestion**

#### `app.py`
- **Endpoint**: `POST /suggest-music`
- **Input**: Images, caption, mood
- **Output**: Music suggestions with metadata
- **Port**: 5004

#### `suggester.py`
- **Functions**:
  - `analyze_content_mood()` - Determine mood from images/caption
  - `search_music()` - Search Spotify/Instagram Audio Library
  - `get_trending_audio()` - Fetch trending sounds
  - `match_music_to_content()` - Find best matches
- **Libraries**: spotipy (Spotify API), requests

---

# 📦 ENVIRONMENT VARIABLES

### **Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### **Backend (.env)**
```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/social_media_automation
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/oauth/instagram/callback

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

REDIS_URL=redis://localhost:6379

AGENT_IMAGE_URL=http://localhost:5001
AGENT_CAPTION_URL=http://localhost:5002
AGENT_VIDEO_URL=http://localhost:5003
AGENT_MUSIC_URL=http://localhost:5004
```

### **Python Agents (.env)**
```
OPENAI_API_KEY=your_openai_key
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
```

---

This complete structure provides every file, its purpose, responsibilities, and how they interact. Focus on building the core workflow first (Hours 0-15), then add analytics and polish!