"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleWeeklyDigest = exports.scheduleDailyReport = exports.queueNotification = exports.queueAIProcessing = exports.queueEmail = exports.getQStashClient = exports.initializeQStash = void 0;
const qstash_1 = require("@upstash/qstash");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
let qstashClient = null;
const initializeQStash = () => {
    if (!env_1.env.QSTASH_TOKEN) {
        logger_1.logger.warn('QStash token not configured, message queue disabled');
        return null;
    }
    qstashClient = new qstash_1.Client({
        token: env_1.env.QSTASH_TOKEN,
    });
    logger_1.logger.info('✅ QStash client initialized (serverless message queue)');
    return qstashClient;
};
exports.initializeQStash = initializeQStash;
const getQStashClient = () => {
    if (!qstashClient) {
        throw new Error('QStash client not initialized');
    }
    return qstashClient;
};
exports.getQStashClient = getQStashClient;
// Email queue
const queueEmail = async (to, subject, body) => {
    if (!qstashClient)
        return null;
    return await qstashClient.publishJSON({
        url: `${env_1.env.FRONTEND_URL}/api/webhooks/email`,
        body: { to, subject, body },
        retries: 3,
        delay: 0,
    });
};
exports.queueEmail = queueEmail;
// AI processing queue
const queueAIProcessing = async (userId, prompt) => {
    if (!qstashClient)
        return null;
    return await qstashClient.publishJSON({
        url: `${env_1.env.FRONTEND_URL}/api/webhooks/ai-process`,
        body: { userId, prompt },
        retries: 2,
        // Schedule for later if needed
        ...(process.env.NODE_ENV === 'production' && { delay: '10s' }),
    });
};
exports.queueAIProcessing = queueAIProcessing;
// Notification queue
const queueNotification = async (userId, title, message) => {
    if (!qstashClient)
        return null;
    return await qstashClient.publishJSON({
        url: `${env_1.env.FRONTEND_URL}/api/webhooks/notification`,
        body: { userId, title, message },
        retries: 3,
    });
};
exports.queueNotification = queueNotification;
// Scheduled jobs (cron)
const scheduleDailyReport = async () => {
    if (!qstashClient)
        return null;
    return await qstashClient.publishJSON({
        url: `${env_1.env.FRONTEND_URL}/api/webhooks/daily-report`,
        body: { type: 'daily_stats' },
        cron: '0 9 * * *', // Every day at 9 AM
    });
};
exports.scheduleDailyReport = scheduleDailyReport;
const scheduleWeeklyDigest = async () => {
    if (!qstashClient)
        return null;
    return await qstashClient.publishJSON({
        url: `${env_1.env.FRONTEND_URL}/api/webhooks/weekly-digest`,
        body: { type: 'weekly_summary' },
        cron: '0 10 * * 1', // Every Monday at 10 AM
    });
};
exports.scheduleWeeklyDigest = scheduleWeeklyDigest;
//# sourceMappingURL=qstash.service.js.map