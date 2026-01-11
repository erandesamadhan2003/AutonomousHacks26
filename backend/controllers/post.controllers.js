import { DraftPost } from '../models/DraftPost.js';
import { PublishedPost } from '../models/PublishedPost.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { startAgentPipeline } from '../services/agent.service.js';
import { publishToInstagram, publishToLinkedIn } from '../services/social.service.js';

// Create Draft
export const createDraft = async (req, res) => {
    const startTime = Date.now();
    console.log('\n🚀 CREATE DRAFT - START');
    console.log('━'.repeat(80));

    try {
        const { caption, platforms, hashtags, scheduledFor } = req.body;
        const userId = req.user._id;

        console.log('📝 Request Data:');
        console.log(`   Caption: ${caption || 'Not provided'}`);
        console.log(`   Platforms: ${platforms || 'instagram (default)'}`);
        console.log(`   Hashtags: ${hashtags || 'None'}`);
        console.log(`   Scheduled: ${scheduledFor || 'Not scheduled'}`);
        console.log(`   Files: ${req.files?.length || 0} images`);

        // Upload images to Cloudinary
        console.log('\n☁️  CLOUDINARY UPLOAD - START');
        const uploadedImages = [];
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                console.log(`   📤 Uploading image ${i + 1}/${req.files.length}: ${file.originalname}`);
                const uploadStart = Date.now();

                const result = await uploadToCloudinary(file.path, 'drafts');
                const uploadTime = Date.now() - uploadStart;

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height
                });

                console.log(`   ✓ Uploaded in ${uploadTime}ms: ${result.secure_url.substring(0, 60)}...`);
            }
        }
        console.log(`☁️  CLOUDINARY UPLOAD - COMPLETE (${uploadedImages.length} images)\n`);

        // Create draft post
        console.log('💾 CREATING DRAFT IN DATABASE');
        const draft = await DraftPost.create({
            userId,
            originalCaption: caption,
            originalImages: uploadedImages,
            platforms: platforms ? platforms.split(',') : ['instagram'],
            hashtags: hashtags ? hashtags.split(',').map(h => h.trim()) : [],
            scheduledFor: scheduledFor || null,
            status: 'processing'
        });
        console.log(`✓ Draft created with ID: ${draft._id}\n`);

        // Trigger agent pipeline
        console.log('🤖 STARTING AI AGENT PIPELINE');
        console.log('━'.repeat(80));
        const pipelineStart = Date.now();

        const job = await startAgentPipeline({
            draftId: draft._id,
            userId,
            originalCaption: caption,
            originalImages: uploadedImages,
            platforms: draft.platforms
        });

        const pipelineTime = Date.now() - pipelineStart;
        console.log(`✓ Pipeline triggered in ${pipelineTime}ms - Job ID: ${job._id}`);
        console.log('━'.repeat(80));

        const totalTime = Date.now() - startTime;
        console.log(`\n✅ CREATE DRAFT - COMPLETE in ${totalTime}ms`);
        console.log('━'.repeat(80));

        res.status(201).json({
            success: true,
            message: 'Draft created and AI processing started',
            data: {
                draftId: draft._id,
                jobId: job._id,
                status: draft.status,
                agentsTriggered: ['captionAgent', 'musicAgent', 'imageAgent', 'videoAgent'],
                timing: {
                    total: `${totalTime}ms`,
                    cloudinaryUpload: `${uploadedImages.length} images`,
                    pipelineStart: `${pipelineTime}ms`
                }
            }
        });
    } catch (error) {
        const totalTime = Date.now() - startTime;
        console.error(`\n❌ CREATE DRAFT - FAILED after ${totalTime}ms`);
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.log('━'.repeat(80));

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

        console.log(`\n📋 FETCHING DRAFTS for user: ${userId}`);
        console.log(`   Filters: status=${status}, platform=${platform}, search=${search}`);

        const query = { userId, isDeleted: false };

        if (status && status !== 'all') query.status = status;
        if (platform && platform !== 'all') query.platforms = platform;
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

        console.log(`   ✓ Found ${drafts.length} drafts (Total: ${total})`);

        // Log draft details
        if (drafts.length > 0) {
            console.log('\n   📊 Draft Summary:');
            drafts.forEach((draft, idx) => {
                console.log(`   ${idx + 1}. ID: ${draft._id}`);
                console.log(`      Status: ${draft.status}`);
                console.log(`      Images: ${draft.originalImages?.length || 0}`);
                console.log(`      Video: ${draft.aiGeneratedVideo ? '✓' : '✗'}`);
                console.log(`      AI Captions: ${draft.aiGeneratedCaptions?.length || 0}`);
            });
        }

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
        console.error('❌ Get drafts error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch drafts'
        });
    }
};

// Get Draft By ID - Enhanced with detailed logging
export const getDraftById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        console.log(`\n📖 FETCHING DRAFT: ${id}`);
        console.log(`   Requested by user: ${userId}`);

        const draft = await DraftPost.findOne({ _id: id, userId, isDeleted: false });

        if (!draft) {
            console.log('   ❌ Draft not found');
            return res.status(404).json({
                success: false,
                message: 'Draft not found'
            });
        }

        console.log('   ✓ Draft found');
        console.log(`   Status: ${draft.status}`);

        // Log all available content
        if (draft.originalImages?.length > 0) {
            console.log(`\n   📸 Original Images (${draft.originalImages.length}):`);
            draft.originalImages.forEach((img, i) => {
                console.log(`      ${i + 1}. ${img.url}`);
            });
        }

        if (draft.aiGeneratedVideo) {
            console.log(`\n   🎬 Generated Video:`);
            console.log(`      Format: ${draft.aiGeneratedVideo.format}`);
            console.log(`      Size: ${draft.aiGeneratedVideo.size} KB`);
            console.log(`      URL Preview: ${draft.aiGeneratedVideo.url.substring(0, 100)}...`);
        }

        if (draft.aiGeneratedCaptions?.length > 0) {
            console.log(`\n   ✍️  AI Captions: ${draft.aiGeneratedCaptions.length} generated`);
        }

        if (draft.musicSuggestions?.length > 0) {
            console.log(`\n   🎵 Music Suggestions: ${draft.musicSuggestions.length} tracks`);
            draft.musicSuggestions.slice(0, 3).forEach((track, i) => {
                console.log(`      ${i + 1}. ${track.title} - ${track.artist}`);
            });
        }

        // Format response with all AI results
        const response = {
            ...draft.toObject(),
            aiResults: {
                captions: draft.aiGeneratedCaptions || [],
                captionsCount: (draft.aiGeneratedCaptions || []).length,
                images: draft.aiGeneratedImages || [],
                imagesCount: (draft.aiGeneratedImages || []).length,
                video: draft.aiGeneratedVideo || null,
                hasVideo: !!draft.aiGeneratedVideo,
                musicSuggestions: draft.musicSuggestions || [],
                musicCount: (draft.musicSuggestions || []).length
            },
            processingComplete: draft.status === 'ready'
        };

        console.log(`   ✓ Returning draft data to client\n`);

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

// Publish Post - Enhanced to include video
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
                    video: draft.selectedVideo || draft.aiGeneratedVideo,  // Include AI-generated video
                    hashtags: draft.hashtags,
                    musicSuggestions: draft.musicSuggestions  // Include music suggestions
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

                    // Create published post record with all AI content
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
                        musicSuggestions: postData.musicSuggestions,
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
            message: 'Post published with all AI enhancements',
            data: {
                draftId: draft._id,
                results: publishResults,
                aiContent: {
                    captionUsed: !!draft.aiGeneratedCaptions.length,
                    videoGenerated: !!draft.aiGeneratedVideo,
                    musicSuggested: !!draft.musicSuggestions.length,
                    imagesProcessed: !!draft.aiGeneratedImages.length
                }
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
