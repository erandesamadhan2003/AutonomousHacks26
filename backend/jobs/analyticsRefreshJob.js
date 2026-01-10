import cron from 'node-cron';
import { PublishedPost } from '../models/PublishedPost.js';
import { getPostMetrics as getInstagramMetrics } from '../services/instagramService.js';
import { getPostAnalytics as getLinkedInMetrics } from '../services/linkedinService.js';
import logger from '../utils/logger.js';

// Run every 6 hours
export const startAnalyticsRefreshJob = () => {
    cron.schedule('0 */6 * * *', async () => {
        logger.info('Starting analytics refresh job');

        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const posts = await PublishedPost.find({
                publishedAt: { $gte: sevenDaysAgo }
            }).populate('socialAccountId');

            for (const post of posts) {
                try {
                    const account = post.socialAccountId;

                    if (!account || !account.accessToken) {
                        continue;
                    }

                    let metrics = {};

                    if (post.platform === 'instagram') {
                        metrics = await getInstagramMetrics(account.accessToken, post.platformPostId);
                    } else if (post.platform === 'linkedin') {
                        metrics = await getLinkedInMetrics(account.accessToken, post.platformPostId);
                    }

                    await post.updateMetrics(metrics);
                    await post.addMetricsSnapshot();

                    logger.info(`Updated metrics for post ${post._id}`);
                } catch (error) {
                    logger.error(`Failed to update metrics for post ${post._id}:`, error);
                }
            }

            logger.info('Analytics refresh job completed');
        } catch (error) {
            logger.error('Analytics refresh job error:', error);
        }
    });
};
