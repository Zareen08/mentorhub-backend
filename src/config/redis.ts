import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { env } from './env';
import { logger } from '../utils/logger';

let redisClient: Redis | null = null;
let rateLimiter: Ratelimit | null = null;

export const connectRedis = async () => {
  try {
    // Upstash Redis connection (serverless, HTTP-based)
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      enableAutoPipelining: true,
    });

    // Test connection
    await redisClient.ping();
    
    // Initialize rate limiter
    rateLimiter = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(100, '10 s'),
      analytics: true,
    });

    logger.info('✅ Upstash Redis connected successfully (serverless)');
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Upstash Redis:', error);
    // Don't throw - allow app to run with fallback
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const getRateLimiter = () => {
  if (!rateLimiter) {
    throw new Error('Rate limiter not initialized');
  }
  return rateLimiter;
};

export const rateLimitRequest = async (identifier: string) => {
  if (!rateLimiter) {
    return { success: true, limit: 100, remaining: 99, reset: Date.now() + 10000 };
  }
  return await rateLimiter.limit(identifier);
};

// Cache helper functions
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data as T | null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

export const cacheSet = async <T>(
  key: string, 
  value: T, 
  ttlSeconds?: number
): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    if (ttlSeconds) {
      await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      await redisClient.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

export const cacheDel = async (pattern: string): Promise<boolean> => {
  if (!redisClient) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    logger.error(`Cache delete error for pattern ${pattern}:`, error);
    return false;
  }
};

export const closeRedis = async () => {
  if (redisClient) {
    // Upstash client doesn't need explicit close
    logger.info('Redis connection closed');
  }
};