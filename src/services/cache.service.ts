import { logger } from '../utils/logger';

// In-memory fallback cache
const memCache = new Map<string, { value: string; expiresAt: number | null }>();

const getRedisClientSafe = () => {
  try {
    // Dynamic require to avoid circular dependency at module load
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getRedisClient } = require('../config/redis');
    return getRedisClient();
  } catch {
    return null;
  }
};

const memGet = (key: string): string | null => {
  const entry = memCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    memCache.delete(key);
    return null;
  }
  return entry.value;
};

const memSet = (key: string, value: string, ttlSeconds?: number): void => {
  memCache.set(key, {
    value,
    expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
  });
};

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedisClientSafe();
      if (redis) {
        const data = await redis.get(key);
        if (!data) return null;
        return (typeof data === 'string' ? JSON.parse(data) : data) as T;
      }
      // Fallback to memory
      const raw = memGet(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      const redis = getRedisClientSafe();
      if (redis) {
        if (ttlSeconds) {
          await redis.setex(key, ttlSeconds, serialized);
        } else {
          await redis.set(key, serialized);
        }
        return true;
      }
      // Fallback to memory
      memSet(key, serialized, ttlSeconds);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      memCache.delete(key);
      const redis = getRedisClientSafe();
      if (redis) await redis.del(key);
      return true;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  async deletePattern(pattern: string): Promise<boolean> {
    try {
      // Clear matching keys from memory cache
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      for (const key of memCache.keys()) {
        if (regex.test(key)) memCache.delete(key);
      }
      const redis = getRedisClientSafe();
      if (redis) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) await redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const redis = getRedisClientSafe();
      if (redis) {
        const result = await redis.exists(key);
        return result === 1;
      }
      return memGet(key) !== null;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  async increment(key: string, by: number = 1): Promise<number> {
    try {
      const redis = getRedisClientSafe();
      if (redis) return await redis.incrby(key, by);
      return 0;
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const redis = getRedisClientSafe();
      if (redis) await redis.expire(key, ttlSeconds);
      return true;
    } catch (error) {
      logger.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }
}

export const cacheService = new CacheService();
