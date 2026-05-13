"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiWorker = exports.aiQueue = exports.scheduleRecommendations = exports.scheduleWeeklyInsights = exports.addAIJob = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const gemini_provider_1 = require("../modules/ai/providers/gemini.provider");
const db_1 = require("../config/db");
const logger_1 = require("../utils/logger");
const notification_job_1 = require("./notification.job");
// Get Redis connection options for BullMQ
const getRedisConnection = () => {
    const redisClient = (0, redis_1.getRedisClient)();
    return redisClient;
};
const connection = getRedisConnection();
// AI Queue
const aiQueue = new bullmq_1.Queue('ai-processing', {
    connection,
});
exports.aiQueue = aiQueue;
// AI Worker
const aiWorker = new bullmq_1.Worker('ai-processing', async (job) => {
    const { type, data } = job.data;
    logger_1.logger.info(`Processing AI job: ${type} (Powered by Google Gemini - Free)`, { jobId: job.id });
    try {
        switch (type) {
            case 'generate-recommendations':
                return await processRecommendations(data);
            case 'analyze-sentiment':
                return await processSentimentAnalysis(data);
            case 'batch-mentor-matching':
                return await processBatchMatching(data);
            case 'weekly-insights':
                return await processWeeklyInsights(data);
            case 'generate-summary':
                return await processSessionSummary(data);
            default:
                throw new Error(`Unknown AI job type: ${type}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`AI job failed: ${type}`, error);
        throw error;
    }
}, {
    connection,
    concurrency: 3,
});
exports.aiWorker = aiWorker;
// Process Recommendations using Gemini
async function processRecommendations(data) {
    const { userId } = data;
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        include: { bookings: { include: { mentor: true } } },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const mentors = await db_1.prisma.mentor.findMany({
        where: { isActive: true },
        include: { user: true },
        take: 20,
    });
    const prompt = `You are an AI mentor matching expert. Based on the user profile below, recommend the best mentors.
  
  User Profile:
  - Name: ${user.name}
  - Expertise areas: ${user.expertise.join(', ')}
  - Bio: ${user.bio || 'No bio provided'}
  - Past bookings: ${user.bookings.length}
  
  Available Mentors (ID, Name, Skills, Rate, Rating):
  ${mentors.map(m => `- ID: ${m.id}, Name: ${m.user.name}, Skills: ${m.skills.join(', ')}, Rate: $${m.hourlyRate}/hr, Rating: ${m.user.rating}`).join('\n')}
  
  Return a JSON array of recommended mentor IDs with scores (0-1) and reasons.
  Format: { "recommendations": [{"mentorId": "id", "score": 0.95, "reason": "why this mentor matches"}] }`;
    const result = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
    const recommendations = result.recommendations || [];
    await db_1.prisma.aILog.create({
        data: {
            userId,
            type: 'RECOMMENDATION',
            prompt: prompt.substring(0, 500),
            response: JSON.stringify(recommendations),
        },
    });
    await (0, notification_job_1.sendNotification)(userId, 'AI Recommendations Ready', `We found ${recommendations.length} mentors that match your profile!`, 'SYSTEM', { recommendations });
    return recommendations;
}
// Process Sentiment Analysis using Gemini
async function processSentimentAnalysis(data) {
    const { reviewId, comments } = data;
    const prompt = `Analyze the sentiment of this review text. Return ONLY a JSON object.
  
  Review Text: "${comments}"
  
  Return format: { "sentiment": "positive/negative/neutral", "score": 0-1, "emotion": "joy/sadness/anger/fear/surprise", "keywords": ["keyword1", "keyword2"] }`;
    const sentiment = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
    if (reviewId) {
        await db_1.prisma.review.update({
            where: { id: reviewId },
            data: { sentiment: sentiment },
        });
    }
    return sentiment;
}
// Process Batch Mentor Matching using Gemini
async function processBatchMatching(data) {
    const { userIds, mentorIds } = data;
    const users = await db_1.prisma.user.findMany({
        where: { id: { in: userIds } },
    });
    const mentors = await db_1.prisma.mentor.findMany({
        where: { id: { in: mentorIds } },
        include: { user: true },
    });
    const matches = [];
    for (const user of users) {
        const prompt = `Match this user with the best mentor from the list.
    
    User: ${user.name}
    Expertise: ${user.expertise.join(', ')}
    
    Available Mentors:
    ${mentors.map(m => `- ID: ${m.id}, Name: ${m.user.name}, Skills: ${m.skills.join(', ')}, Rate: $${m.hourlyRate}, Rating: ${m.user.rating}`).join('\n')}
    
    Return JSON: { "mentorId": "id", "score": 0-1, "reason": "why this is the best match" }`;
        const match = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
        matches.push({ userId: user.id, match });
    }
    return matches;
}
// Process Weekly Insights using Gemini
async function processWeeklyInsights(data) {
    const stats = await db_1.prisma.$transaction([
        db_1.prisma.booking.count({ where: { createdAt: { gte: data.startDate } } }),
        db_1.prisma.user.count({ where: { createdAt: { gte: data.startDate } } }),
        db_1.prisma.mentor.count(),
        db_1.prisma.review.aggregate({ _avg: { rating: true } }),
        db_1.prisma.booking.aggregate({ _sum: { totalAmount: true } }),
    ]);
    const prompt = `Generate weekly platform insights based on this data:
  
  Metrics:
  - New Bookings: ${stats[0]}
  - New Users: ${stats[1]}
  - Total Mentors: ${stats[2]}
  - Average Rating: ${stats[3]._avg.rating || 0}
  - Total Revenue: $${stats[4]._sum.totalAmount || 0}
  
  Return JSON format:
  {
    "trend": "UP/DOWN/STABLE",
    "percentageChange": number,
    "recommendations": ["recommendation 1", "recommendation 2"],
    "keyInsights": ["insight 1", "insight 2"],
    "growthAreas": ["area 1", "area 2"],
    "alert": "any important alert or null"
  }`;
    const insights = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
    await db_1.prisma.aILog.create({
        data: {
            type: 'INSIGHT',
            prompt: prompt.substring(0, 500),
            response: JSON.stringify(insights),
        },
    });
    return insights;
}
// Process Session Summary using Gemini
async function processSessionSummary(data) {
    const { bookingId } = data;
    const booking = await db_1.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            user: true,
            mentor: { include: { user: true } },
        },
    });
    if (!booking) {
        throw new Error('Booking not found');
    }
    const prompt = `Generate a professional session summary for this mentorship session:
  
  Session Details:
  - Mentor: ${booking.mentor.user.name}
  - Student: ${booking.user.name}
  - Date: ${booking.date.toLocaleDateString()}
  - Duration: ${booking.duration} minutes
  - Student Notes: ${booking.notes || 'No notes provided'}
  
  Create a comprehensive summary that includes:
  1. Key topics discussed (3-5 bullet points)
  2. Action items for the student (specific, actionable steps)
  3. Resources recommended (if any)
  4. Next session topics to cover
  5. Overall progress assessment
  
  Make it professional, encouraging, and actionable. Keep it under 500 words.`;
    const summary = await (0, gemini_provider_1.generateGeminiResponse)(prompt);
    return { summary, bookingId };
}
// Add AI job to queue
const addAIJob = async (type, data, delay) => {
    return await aiQueue.add(type, { type, data }, { delay });
};
exports.addAIJob = addAIJob;
// Schedule recurring jobs
const scheduleWeeklyInsights = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    return await (0, exports.addAIJob)('weekly-insights', { startDate }, 0);
};
exports.scheduleWeeklyInsights = scheduleWeeklyInsights;
const scheduleRecommendations = async (userId) => {
    return await (0, exports.addAIJob)('generate-recommendations', { userId }, 0);
};
exports.scheduleRecommendations = scheduleRecommendations;
//# sourceMappingURL=ai.job.js.map