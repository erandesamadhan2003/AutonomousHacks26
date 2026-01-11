import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        // Stop noisy infinite retries when Redis is not running locally
        reconnectStrategy: () => false
    },
    password: process.env.REDIS_PASSWORD || undefined
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error(' Redis client error:', err);
});

const connectRedis = async () => {
    if (!REDIS_ENABLED) {
        console.warn('Redis disabled via REDIS_ENABLED=false; skipping connection');
        return;
    }

    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Redis connection error:', error);
    }
};

export { redisClient, connectRedis };
