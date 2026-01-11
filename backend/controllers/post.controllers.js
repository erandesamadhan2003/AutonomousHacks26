import { DraftPost } from '../models/DraftPost.js';
import { PublishedPost } from '../models/PublishedPost.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { startAgentPipeline } from '../services/agent.service.js';
import { publishToInstagram, publishToLinkedIn } from '../services/social.service.js';

// Create Draft
export const createDraft = async (req, res) => {
    try {
        const { caption, platforms, hashtags, scheduledFor } = req.body;
        const userId = req.user._id;

        // Upload images to Cloudinary
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.path, 'drafts');
                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height
                });
            }
        }

        // Create draft post
        const draft = await DraftPost.create({
            userId,
            originalCaption: caption,
            originalImages: uploadedImages,
            platforms: platforms ? platforms.split(',') : ['instagram'],
            hashtags: hashtags ? hashtags.split(',').map(h => h.trim()) : [],
            scheduledFor: scheduledFor || null,
            status: 'processing'
        });

        // Trigger agent pipeline with all agents (caption + music)
        console.log('🤖 Starting AI agent pipeline...');
        const job = await startAgentPipeline({
            draftId: draft._id,
            userId,
            originalCaption: caption,
            originalImages: uploadedImages,
            platforms: draft.platforms
        });

        console.log(`✓ AI processing started - Job ID: ${job._id}`);

        res.status(201).json({
            success: true,
            message: 'Draft created and AI processing started (caption & music)',
            data: {
                draftId: draft._id,
                jobId: job._id,
                status: draft.status,
                agentsTriggered: ['captionAgent', 'musicAgent', 'imageAgent', 'videoAgent']
            }
        });
    } catch (error) {
        console.error('Create draft error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create draft'
        });
    }
};

// Get Drafts
export const getDrafts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, platform, search, page = 1, limit = 10 } = req.query;

        const query = { userId, isDeleted: false };

        if (status) query.status = status;
        if (platform) query.platforms = platform;
        if (search) {
            query.$or = [
                { originalCaption: { $regex: search, $options: 'i' } },
                { 'aiGeneratedCaptions.text': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await DraftPost.countDocuments(query);

        const drafts = await DraftPost.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        res.status(200).json({
            success: true,
            data: drafts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get drafts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch drafts'
        });
    }
};

// Get Draft By ID - Enhanced to show music suggestions
export const getDraftById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const draft = await DraftPost.findOne({ _id: id, userId, isDeleted: false });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        // Format response with music suggestions
        const response = {
            ...draft.toObject(),
            aiResults: {
                captions: draft.aiGeneratedCaptions || [],
                images: draft.aiGeneratedImages || [],
                video: draft.aiGeneratedVideo || null,
                musicSuggestions: draft.musicSuggestions || []
            }
        };

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Get draft by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch draft'
        });
    }
};

// Update Draft
export const updateDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updates = req.body;

        const draft = await DraftPost.findOne({ _id: id, userId, isDeleted: false });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        // Update allowed fields
        const allowedUpdates = [
            'selectedCaption',
            'selectedImages',
            'selectedVideo',
            'selectedMusic',
            'platforms',
            'hashtags',
            'scheduledFor',
            'status'
        ];

        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                draft[field] = updates[field];
            }
        });

        await draft.save();

        res.status(200).json({
            success: true,
            message: 'Draft updated successfully',
            data: draft
        });
    } catch (error) {
        console.error('Update draft error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update draft'
        });
    }
};

// Delete Draft
export const deleteDraft = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const draft = await DraftPost.findOne({ _id: id, userId, isDeleted: false });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        // Delete images from Cloudinary
        const allImages = [
            ...draft.originalImages,
            ...draft.aiGeneratedImages
        ];

        for (const image of allImages) {
            if (image.publicId) {
                await deleteFromCloudinary(image.publicId);
            }
        }

        // Soft delete
        draft.isDeleted = true;
        await draft.save();

        res.status(200).json({
            success: true,
            message: 'Draft deleted successfully'
        });
    } catch (error) {
        console.error('Delete draft error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete draft'
        });
    }
};

// Publish Post
export const publishPost = async (req, res) => {
    try {
        const { draftId, platforms } = req.body;
        const userId = req.user._id;

        const draft = await DraftPost.findOne({ _id: draftId, userId, isDeleted: false });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        const publishResults = [];
        const targetPlatforms = platforms || draft.platforms;

        // Publish to each platform
        for (const platform of targetPlatforms) {
            try {
                let result;
                const postData = {
                    caption: draft.selectedCaption || draft.originalCaption,
                    images: draft.selectedImages || draft.originalImages,
                    video: draft.selectedVideo,
                    hashtags: draft.hashtags
                };

                if (platform === 'instagram') {
                    result = await publishToInstagram(userId, postData);
                } else if (platform === 'linkedin') {
                    result = await publishToLinkedIn(userId, postData);
                }

                if (result.success) {
                    publishResults.push({
                        platform,
                        success: true,
                        postId: result.postId,
                        url: result.url
                    });

                    // Create published post record
                    await PublishedPost.create({
                        userId,
                        draftId: draft._id,
                        platform,
                        platformPostId: result.postId,
                        postUrl: result.url,
                        caption: postData.caption,
                        images: postData.images,
                        video: postData.video,
                        hashtags: postData.hashtags,
                        publishedAt: new Date()
                    });
                } else {
                    publishResults.push({
                        platform,
                        success: false,
                        error: result.error
                    });
                }
            } catch (error) {
                publishResults.push({
                    platform,
                    success: false,
                    error: error.message
                });
            }
        }

        // Update draft status
        draft.status = 'published';
        draft.publishedAt = new Date();
        await draft.save();

        res.status(200).json({
            success: true,
            message: 'Post published',
            data: {
                draftId: draft._id,
                results: publishResults
            }
        });
    } catch (error) {
        console.error('Publish post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to publish post'
        });
    }
};

// Get Published Posts
export const getPublishedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { platform, dateFrom, dateTo, page = 1, limit = 10 } = req.query;

        const query = { userId, isDeleted: false };

        if (platform) query.platform = platform;
        if (dateFrom || dateTo) {
            query.publishedAt = {};
            if (dateFrom) query.publishedAt.$gte = new Date(dateFrom);
            if (dateTo) query.publishedAt.$lte = new Date(dateTo);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await PublishedPost.countDocuments(query);

        const posts = await PublishedPost.find(query)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('-__v');

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get published posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch published posts'
        });
    }
};

// Get Published Post By ID
export const getPublishedPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await PublishedPost.findOne({ _id: id, userId, isDeleted: false });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Get published post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch post'
        });
    }
};

// Delete Published Post
export const deletePublishedPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const post = await PublishedPost.findOne({ _id: id, userId, isDeleted: false });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        post.isDeleted = true;
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete post'
        });
    }
};
