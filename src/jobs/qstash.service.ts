import { Client } from '@upstash/qstash';
import { env } from '../config/env';
import { logger } from '../utils/logger';

let qstashClient: Client | null = null;

export const initializeQStash = () => {
  if (!env.QSTASH_TOKEN) {
    logger.warn('QStash token not configured, message queue disabled');
    return null;
  }

  qstashClient = new Client({
    token: env.QSTASH_TOKEN,
  });

  logger.info('✅ QStash client initialized (serverless message queue)');
  return qstashClient;
};

export const getQStashClient = () => {
  if (!qstashClient) {
    throw new Error('QStash client not initialized');
  }
  return qstashClient;
};

// Email queue
export const queueEmail = async (to: string, subject: string, body: string) => {
  if (!qstashClient) return null;
  
  return await qstashClient.publishJSON({
    url: `${env.FRONTEND_URL}/api/webhooks/email`,
    body: { to, subject, body },
    retries: 3,
    delay: 0,
  });
};

// AI processing queue
export const queueAIProcessing = async (userId: string, prompt: string) => {
  if (!qstashClient) return null;
  
  return await qstashClient.publishJSON({
    url: `${env.FRONTEND_URL}/api/webhooks/ai-process`,
    body: { userId, prompt },
    retries: 2,
    // Schedule for later if needed
    ...(process.env.NODE_ENV === 'production' && { delay: '10s' }),
  });
};

// Notification queue
export const queueNotification = async (userId: string, title: string, message: string) => {
  if (!qstashClient) return null;
  
  return await qstashClient.publishJSON({
    url: `${env.FRONTEND_URL}/api/webhooks/notification`,
    body: { userId, title, message },
    retries: 3,
  });
};

// Scheduled jobs (cron)
export const scheduleDailyReport = async () => {
  if (!qstashClient) return null;
  
  return await qstashClient.publishJSON({
    url: `${env.FRONTEND_URL}/api/webhooks/daily-report`,
    body: { type: 'daily_stats' },
    cron: '0 9 * * *', // Every day at 9 AM
  });
};

export const scheduleWeeklyDigest = async () => {
  if (!qstashClient) return null;
  
  return await qstashClient.publishJSON({
    url: `${env.FRONTEND_URL}/api/webhooks/weekly-digest`,
    body: { type: 'weekly_summary' },
    cron: '0 10 * * 1', // Every Monday at 10 AM
  });
};