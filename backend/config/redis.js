import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
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
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Redis connection error:', error);
    }
};

export { redisClient, connectRedis };
