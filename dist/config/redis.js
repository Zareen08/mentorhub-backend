"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedis = exports.cacheDel = exports.cacheSet = exports.cacheGet = exports.rateLimitRequest = exports.getRateLimiter = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("@upstash/redis");
const ratelimit_1 = require("@upstash/ratelimit");
const logger_1 = require("../utils/logger");
let redisClient = null;
let rateLimiter = null;
const connectRedis = async () => {
    try {
        // Upstash Redis connection (serverless, HTTP-based)
        redisClient = new redis_1.Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
            enableAutoPipelining: true,
        });
        // Test connection
        await redisClient.ping();
        // Initialize rate limiter
        rateLimiter = new ratelimit_1.Ratelimit({
            redis: redisClient,
            limiter: ratelimit_1.Ratelimit.slidingWindow(100, '10 s'),
            analytics: true,
        });
        logger_1.logger.info('✅ Upstash Redis connected successfully (serverless)');
        return redisClient;
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to Upstash Redis:', error);
        // Don't throw - allow app to run with fallback
        return null;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
const getRateLimiter = () => {
    if (!rateLimiter) {
        throw new Error('Rate limiter not initialized');
    }
    return rateLimiter;
};
exports.getRateLimiter = getRateLimiter;
const rateLimitRequest = async (identifier) => {
    if (!rateLimiter) {
        return { success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 };
    }
    return await rateLimiter.limit(identifier);
};
exports.rateLimitRequest = rateLimitRequest;
// Cache helper functions
const cacheGet = async (key) => {
    if (!redisClient)
        return null;
    try {
        const data = await redisClient.get(key);
        return data;
    }
    catch (error) {
        logger_1.logger.error(`Cache get error for key ${key}:`, error);
        return null;
    }
};
exports.cacheGet = cacheGet;
const cacheSet = async (key, value, ttlSeconds) => {
    if (!redisClient)
        return false;
    try {
        if (ttlSeconds) {
            await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
        }
        else {
            await redisClient.set(key, JSON.stringify(value));
        }
        return true;
    }
    catch (error) {
        logger_1.logger.error(`Cache set error for key ${key}:`, error);
        return false;
    }
};
exports.cacheSet = cacheSet;
const cacheDel = async (pattern) => {
    if (!redisClient)
        return false;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
        }
        return true;
    }
    catch (error) {
        logger_1.logger.error(`Cache delete error for pattern ${pattern}:`, error);
        return false;
    }
};
exports.cacheDel = cacheDel;
const closeRedis = async () => {
    if (redisClient) {
        // Upstash client doesn't need explicit close
        logger_1.logger.info('Redis connection closed');
    }
};
exports.closeRedis = closeRedis;
//# sourceMappingURL=redis.js.map