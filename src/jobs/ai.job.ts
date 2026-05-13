import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { getRedisClient } from '../config/redis';
import { getGeminiModel, generateGeminiStructuredResponse, generateGeminiResponse } from '../modules/ai/providers/gemini.provider';
import { prisma } from '../config/db';
import { logger } from '../utils/logger';
import { sendNotification } from './notification.job';

interface AIJobData {
  type: string;
  data: any;
}

// Get Redis connection options for BullMQ
const getRedisConnection = () => {
  const redisClient = getRedisClient();
  return redisClient as unknown as IORedis;
};

const connection = getRedisConnection();

// AI Queue
const aiQueue = new Queue('ai-processing', {
  connection,
});

// AI Worker
const aiWorker = new Worker('ai-processing', async (job: Job<AIJobData>) => {
  const { type, data } = job.data;
  
  logger.info(`Processing AI job: ${type} (Powered by Google Gemini - Free)`, { jobId: job.id });
  
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
  } catch (error) {
    logger.error(`AI job failed: ${type}`, error);
    throw error;
  }
}, {
  connection,
  concurrency: 3,
});

// Process Recommendations using Gemini
async function processRecommendations(data: any) {
  const { userId } = data;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { bookings: { include: { mentor: true } } },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const mentors = await prisma.mentor.findMany({
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
  
  const result = await generateGeminiStructuredResponse(prompt);
  const recommendations = result.recommendations || [];
  
  await prisma.aILog.create({
    data: {
      userId,
      type: 'RECOMMENDATION',
      prompt: prompt.substring(0, 500),
      response: JSON.stringify(recommendations),
    },
  });
  
  await sendNotification(
    userId,
    'AI Recommendations Ready',
    `We found ${recommendations.length} mentors that match your profile!`,
    'SYSTEM',
    { recommendations }
  );
  
  return recommendations;
}

// Process Sentiment Analysis using Gemini
async function processSentimentAnalysis(data: any) {
  const { reviewId, comments } = data;
  
  const prompt = `Analyze the sentiment of this review text. Return ONLY a JSON object.
  
  Review Text: "${comments}"
  
  Return format: { "sentiment": "positive/negative/neutral", "score": 0-1, "emotion": "joy/sadness/anger/fear/surprise", "keywords": ["keyword1", "keyword2"] }`;
  
  const sentiment = await generateGeminiStructuredResponse(prompt);
  
  if (reviewId) {
    await prisma.review.update({
      where: { id: reviewId },
      data: { sentiment: sentiment as any },
    });
  }
  
  return sentiment;
}

// Process Batch Mentor Matching using Gemini
async function processBatchMatching(data: any) {
  const { userIds, mentorIds } = data;
  
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
  });
  
  const mentors = await prisma.mentor.findMany({
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
    
    const match = await generateGeminiStructuredResponse(prompt);
    matches.push({ userId: user.id, match });
  }
  
  return matches;
}

// Process Weekly Insights using Gemini
async function processWeeklyInsights(data: any) {
  const stats = await prisma.$transaction([
    prisma.booking.count({ where: { createdAt: { gte: data.startDate } } }),
    prisma.user.count({ where: { createdAt: { gte: data.startDate } } }),
    prisma.mentor.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.booking.aggregate({ _sum: { totalAmount: true } }),
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
  
  const insights = await generateGeminiStructuredResponse(prompt);
  
  await prisma.aILog.create({
    data: {
      type: 'INSIGHT',
      prompt: prompt.substring(0, 500),
      response: JSON.stringify(insights),
    },
  });
  
  return insights;
}

// Process Session Summary using Gemini
async function processSessionSummary(data: any) {
  const { bookingId } = data;
  
  const booking = await prisma.booking.findUnique({
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
  
  const summary = await generateGeminiResponse(prompt);
  
  return { summary, bookingId };
}

// Add AI job to queue
export const addAIJob = async (type: string, data: any, delay?: number) => {
  return await aiQueue.add(type, { type, data }, { delay });
};

// Schedule recurring jobs
export const scheduleWeeklyInsights = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  return await addAIJob('weekly-insights', { startDate }, 0);
};

export const scheduleRecommendations = async (userId: string) => {
  return await addAIJob('generate-recommendations', { userId }, 0);
};

export { aiQueue, aiWorker };