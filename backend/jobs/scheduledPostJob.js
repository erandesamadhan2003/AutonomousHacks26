import cron from 'node-cron';
import { DraftPost } from '../models/DraftPost.js';
import { PublishedPost } from '../models/PublishedPost.js';
import { publishImage, publishCarousel, publishReel } from '../services/instagramService.js';
import { publishPost as publishToLinkedIn } from '../services/linkedinService.js';
import logger from '../utils/logger.js';

// Run every 5 minutes
export const startScheduledPostJob = () => {
    cron.schedule('*/5 * * * *', async () => {
        logger.info('Checking for scheduled posts');

        try {
            const now = new Date();

            const scheduledPosts = await DraftPost.find({
                status: 'scheduled',
                scheduledAt: { $lte: now }
            }).populate('socialAccountId');

            for (const draft of scheduledPosts) {
                try {
                    const account = draft.socialAccountId;

                    if (!account || !account.accessToken) {
                        draft.status = 'failed';
                        draft.publishError = 'Social account not found or token expired';
                        await draft.save();
                        continue;
                    }

                    let platformPostId;
                    const caption = draft.selectedCaption || draft.generatedCaptions[0]?.text || '';
                    const hashtags = draft.hashtags.map(h => h.tag).join(' ');
                    const fullCaption = `${caption}\n\n${hashtags}`;

                    if (draft.platform === 'instagram') {
                        if (draft.generatedVideo) {
                            platformPostId = await publishReel(account.accessToken, draft.generatedVideo.url, fullCaption);
                        } else if (draft.processedImages.length > 1) {
                            const imageUrls = draft.processedImages.map(img => img.url);
                            platformPostId = await publishCarousel(account.accessToken, imageUrls, fullCaption);
                        } else {
                            platformPostId = await publishImage(account.accessToken, draft.processedImages[0].url, fullCaption);
                        }
                    } else if (draft.platform === 'linkedin') {
                        const imageUrls = draft.processedImages.map(img => img.url);
                        platformPostId = await publishToLinkedIn(account.accessToken, account.platformUserId, fullCaption, imageUrls);
                    }

                    const publishedPost = await PublishedPost.create({
                        userId: draft.userId,
                        socialAccountId: draft.socialAccountId,
                        draftPostId: draft._id,
                        platform: draft.platform,
                        platformPostId: platformPostId,
                        caption: fullCaption,
                        hashtags: draft.hashtags.map(h => h.tag),
                        mediaUrls: draft.processedImages.map(img => img.url),
                        postType: draft.generatedVideo ? 'video' : (draft.processedImages.length > 1 ? 'carousel' : 'image')
                    });

                    draft.status = 'published';
                    draft.publishedAt = new Date();
                    draft.publishedPostId = platformPostId;
                    await draft.save();

                    logger.info(`Published scheduled post ${draft._id} to ${draft.platform}`);
                } catch (error) {
                    logger.error(`Failed to publish scheduled post ${draft._id}:`, error);
                    draft.status = 'failed';
                    draft.publishError = error.message;
                    await draft.save();
                }
            }
        } catch (error) {
            logger.error('Scheduled post job error:', error);
        }
    });
};
