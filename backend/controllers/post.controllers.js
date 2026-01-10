import { AgentJob } from '../models/AgentJob.js';
import { DraftPost } from '../models/DraftPost.js';
import { PublishedPost } from '../models/PublishedPost.js';
import { SocialAccount } from '../models/SocialAccount.js';

export const createDraft = async (req, res) => {
    try {
        const { socialAccountId, platform, description } = req.body;
        const images = req.files;

        if (!socialAccountId || !platform || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const socialAccount = await SocialAccount.findOne({
            _id: socialAccountId,
            userId: req.user._id
        });

        if (!socialAccount) {
            return res.status(404).json({
                success: false,
                message: 'Social account not found'
            });
        }

        const uploadedImages = images ? images.map(file => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            size: file.size
        })) : [];

        const draft = await DraftPost.create({
            userId: req.user._id,
            socialAccountId,
            platform,
            userDescription: description,
            uploadedImages,
            status: 'processing',
            agentStatus: {
                imageProcessing: { status: 'pending' },
                captionGeneration: { status: 'pending' },
                videoGeneration: { status: 'pending' },
                musicSuggestion: { status: 'pending' }
            }
        });

        // Queue agent jobs
        const agentTypes = ['image_processing', 'caption_generation', 'video_generation', 'music_suggestion'];
        for (const agentType of agentTypes) {
            await AgentJob.create({
                draftPostId: draft._id,
                agentType,
                status: 'pending',
                priority: 5,
                inputData: {
                    description,
                    images: uploadedImages
                }
            });
        }

        res.status(201).json({
            success: true,
            data: {
                draftId: draft._id,
                status: draft.status,
                message: 'Your content is being processed by our AI agents'
            }
        });
    } catch (error) {
        console.error('Create draft error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating draft'
        });
    }
};

export const getDraftStatus = async (req, res) => {
    try {
        const { draftId } = req.params;

        const draft = await DraftPost.findOne({
            _id: draftId,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: draft._id,
                status: draft.status,
                agentStatus: draft.agentStatus,
                generatedContent: {
                    processedImages: draft.processedImages,
                    captions: draft.generatedCaptions,
                    hashtags: draft.hashtags.map(h => h.tag),
                    video: draft.generatedVideo,
                    musicSuggestions: draft.musicSuggestions
                }
            }
        });
    } catch (error) {
        console.error('Get draft status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching draft'
        });
    }
};

export const updateDraft = async (req, res) => {
    try {
        const { draftId } = req.params;
        const { selectedCaption, selectedImages, selectedMusic, additionalHashtags } = req.body;

        const draft = await DraftPost.findOne({
            _id: draftId,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        if (selectedCaption) draft.selectedCaption = selectedCaption;
        if (selectedMusic) draft.selectedMusic = selectedMusic;
        if (selectedImages) draft.processedImages = selectedImages.map(url => ({ url, variant: 'selected' }));
        if (additionalHashtags) {
            draft.hashtags.push(...additionalHashtags.map(tag => ({ tag, relevanceScore: 0.8 })));
        }

        draft.status = 'ready';
        await draft.save();

        res.json({
            success: true,
            data: {
                draftId: draft._id,
                status: draft.status,
                updatedContent: {
                    selectedCaption: draft.selectedCaption,
                    processedImages: draft.processedImages,
                    selectedMusic: draft.selectedMusic,
                    hashtags: draft.hashtags
                }
            }
        });
    } catch (error) {
        console.error('Update draft error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating draft'
        });
    }
};

export const getAllDrafts = async (req, res) => {
    try {
        const { status, limit = 10, page = 1 } = req.query;

        const query = { userId: req.user._id };
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const drafts = await DraftPost.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .populate('socialAccountId', 'platform username');

        const total = await DraftPost.countDocuments(query);

        res.json({
            success: true,
            data: {
                drafts,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get drafts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching drafts'
        });
    }
};

export const publishPost = async (req, res) => {
    try {
        const { draftId, scheduleAt } = req.body;

        const draft = await DraftPost.findOne({
            _id: draftId,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        if (draft.status !== 'ready') {
            return res.status(400).json({
                success: false,
                message: 'Draft is not ready for publishing'
            });
        }

        if (scheduleAt) {
            draft.scheduledAt = new Date(scheduleAt);
            draft.status = 'scheduled';
            await draft.save();

            return res.json({
                success: true,
                data: {
                    draftId: draft._id,
                    status: 'scheduled',
                    scheduledAt: draft.scheduledAt
                }
            });
        }

        // TODO: Implement actual publishing to social media platform
        const mockPlatformPostId = `${draft.platform}_${Date.now()}`;

        const publishedPost = await PublishedPost.create({
            userId: req.user._id,
            socialAccountId: draft.socialAccountId,
            draftPostId: draft._id,
            platform: draft.platform,
            platformPostId: mockPlatformPostId,
            caption: draft.selectedCaption || draft.generatedCaptions[0]?.text,
            hashtags: draft.hashtags.map(h => h.tag),
            mediaUrls: draft.processedImages.map(img => img.url),
            postType: draft.generatedVideo ? 'video' : 'image'
        });

        draft.status = 'published';
        draft.publishedAt = new Date();
        draft.publishedPostId = mockPlatformPostId;
        await draft.save();

        res.json({
            success: true,
            data: {
                publishedPostId: publishedPost._id,
                platformPostId: mockPlatformPostId,
                publishedAt: publishedPost.publishedAt,
                postUrl: `https://${draft.platform}.com/p/${mockPlatformPostId}`
            }
        });
    } catch (error) {
        console.error('Publish post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while publishing post'
        });
    }
};

export const getPublishedPosts = async (req, res) => {
    try {
        const { platform, limit = 20, page = 1 } = req.query;

        const query = { userId: req.user._id };
        if (platform) query.platform = platform;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await PublishedPost.find(query)
            .sort({ publishedAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await PublishedPost.countDocuments(query);

        const formattedPosts = posts.map(post => ({
            id: post._id,
            caption: post.caption,
            mediaUrls: post.mediaUrls,
            publishedAt: post.publishedAt,
            platform: post.platform,
            metrics: post.metrics
        }));

        res.json({
            success: true,
            data: {
                posts: formattedPosts,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get published posts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while fetching published posts'
        });
    }
};
