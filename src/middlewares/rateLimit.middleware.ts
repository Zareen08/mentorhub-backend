import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const identifier = req.user?.id 
      ? `user:${req.user.id}`
      : `ip:${req.ip}`;
    
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    
    const now = Date.now();
    const record = inMemoryStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      inMemoryStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      next();
      return;
    }
    
    if (record.count < maxRequests) {
      record.count++;
      inMemoryStore.set(identifier, record);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - record.count);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      next();
      return;
    }
    
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
      retryAfter,
    });
  } catch (error) {
    logger.error('Rate limit error:', error);
    next();
  }
};

export const authRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const identifier = `auth:${req.ip}`;
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 5;
    
    const now = Date.now();
    let record = inMemoryStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      inMemoryStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }
    
    if (record.count < maxRequests) {
      record.count++;
      inMemoryStore.set(identifier, record);
      next();
      return;
    }
    
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.status(429).json({
      success: false,
      error: 'Too many login attempts, please try again later.',
      retryAfter,
    });
  } catch (error) {
    next();
  }
};

export const aiRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.id || req.ip;
    const identifier = `ai:${userId}`;
    const windowMs = 60 * 60 * 1000;
    const maxRequests = 50;
    
    const now = Date.now();
    let record = inMemoryStore.get(identifier);
    
    if (!record || now > record.resetTime) {
      inMemoryStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }
    
    if (record.count < maxRequests) {
      record.count++;
      inMemoryStore.set(identifier, record);
      next();
      return;
    }
    
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    res.status(429).json({
      success: false,
      error: 'AI request limit reached. Please try again later.',
      retryAfter,
    });
  } catch (error) {
    next();
  }
};