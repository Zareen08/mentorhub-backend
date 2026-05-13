"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const gemini_provider_1 = require("./providers/gemini.provider");
const db_1 = require("../../config/db");
const ai_prompts_1 = require("./ai.prompts");
class AIService {
    // AI Feature 1: Mentor Recommendations
    async getMentorRecommendations(userId) {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: { mentor: true },
                    take: 5,
                },
            },
        });
        if (!user)
            throw new Error('User not found');
        const mentors = await db_1.prisma.mentor.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: { name: true, rating: true, expertise: true },
                },
            },
            take: 20,
        });
        const prompt = `${ai_prompts_1.AI_PROMPTS.RECOMMENDATION}
    
    User Profile:
    - Name: ${user.name}
    - Expertise areas: ${user.expertise.join(', ')}
    - Past bookings: ${user.bookings.length}
    
    Available Mentors: ${JSON.stringify(mentors.map(m => ({
            id: m.id,
            name: m.user.name,
            skills: m.skills,
            rate: m.hourlyRate,
            rating: m.user.rating
        })))}
    
    Return JSON format: { "recommendations": [{"mentorId": "id", "score": 0.95, "reason": "reason"}] }`;
        const result = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
        await db_1.prisma.aILog.create({
            data: {
                userId,
                type: 'RECOMMENDATION',
                prompt: prompt.substring(0, 500),
                response: JSON.stringify(result),
            },
        });
        return result.recommendations || [];
    }
    // AI Feature 2: Chat Assistant
    async chat(userId, message, context) {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, role: true, expertise: true },
        });
        const systemPrompt = `${ai_prompts_1.AI_PROMPTS.CHAT}
    
    User Context:
    - Name: ${user?.name}
    - Role: ${user?.role}
    - Expertise: ${user?.expertise?.join(', ') || 'None'}
    - Conversation Context: ${context || 'New conversation'}
    
    Be helpful, professional, and specific. Keep responses concise.`;
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
        const result = await gemini.generateContent(fullPrompt);
        const response = await result.response;
        const responseText = response.text();
        await db_1.prisma.aILog.create({
            data: {
                userId,
                type: 'CHAT',
                prompt: message,
                response: responseText,
            },
        });
        return { response: responseText };
    }
    // AI Feature 3: Smart Matching
    async findBestMentorMatch(userId, goal, budget) {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const mentors = await db_1.prisma.mentor.findMany({
            where: { isActive: true },
            include: {
                user: {
                    select: { name: true, rating: true, expertise: true },
                },
            },
        });
        const prompt = `${ai_prompts_1.AI_PROMPTS.MATCHING}
    
    User Goal: ${goal}
    Budget: ${budget || 'No specified budget'}
    
    Mentors Available: ${JSON.stringify(mentors.map(m => ({
            id: m.id,
            name: m.user.name,
            skills: m.skills,
            rate: m.hourlyRate,
            rating: m.user.rating,
            experience: m.experience
        })))}
    
    Return JSON format: { "matches": [{"mentorId": "id", "score": 0.9, "reason": "why", "expectedImprovement": "what they'll gain"}] }`;
        const matches = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
        return matches.matches || [];
    }
    // AI Feature 4: Market Insights & Analytics
    async getMarketInsights() {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const [totalMentors, totalBookings, averageRating, topSkills] = await Promise.all([
            db_1.prisma.mentor.count(),
            db_1.prisma.booking.count({ where: { status: 'COMPLETED' } }),
            db_1.prisma.review.aggregate({ _avg: { rating: true } }),
            db_1.prisma.mentor.findMany({
                select: { skills: true },
                take: 100,
            }),
        ]);
        const skillFrequency = {};
        topSkills.forEach(mentor => {
            mentor.skills.forEach(skill => {
                skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            });
        });
        const topDemandedSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([skill]) => skill);
        const prompt = `${ai_prompts_1.AI_PROMPTS.INSIGHTS}
    
    Platform Data:
    - Total Mentors: ${totalMentors}
    - Total Completed Sessions: ${totalBookings}
    - Average Rating: ${averageRating._avg.rating || 0}
    - Top Demanded Skills: ${topDemandedSkills.join(', ')}
    
    Provide insights on mentorship trends, platform health, and recommendations.
    Return JSON format: { "trend": "UP/DOWN/STABLE", "recommendations": ["rec1", "rec2"], "keyInsights": ["insight1"], "growthAreas": ["area1"] }`;
        const insights = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
        return {
            totalMentors,
            totalBookings,
            averageRating: averageRating._avg.rating || 0,
            topSkills: topDemandedSkills,
            aiInsights: insights,
        };
    }
    // AI Feature 5: Session Summary Generator (Bonus)
    async generateSessionSummary(bookingId) {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const booking = await db_1.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                mentor: { include: { user: true } },
            },
        });
        if (!booking)
            throw new Error('Booking not found');
        const prompt = `Generate a professional session summary for a mentorship session:
    
    Mentor: ${booking.mentor.user.name}
    Student: ${booking.user.name}
    Date: ${booking.date}
    Duration: ${booking.duration} minutes
    Notes: ${booking.notes || 'No notes provided'}
    
    Create a summary that includes:
    1. Key topics covered
    2. Action items for the student
    3. Resources recommended
    4. Next steps
    5. Follow-up plan
    
    Make it professional, actionable, and encouraging.`;
        const result = await gemini.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    // AI Feature 6: Sentiment Analysis
    async analyzeSentiment(text) {
        const gemini = (0, gemini_provider_1.getGeminiModel)();
        const prompt = `Analyze the sentiment of this text and return JSON:
    Text: "${text}"
    
    Return: { "sentiment": "positive/negative/neutral", "score": 0-1, "emotion": "joy/sadness/anger/fear/surprise", "keywords": ["keyword1", "keyword2"] }`;
        const result = await (0, gemini_provider_1.generateGeminiStructuredResponse)(prompt);
        return {
            sentiment: result.sentiment || 'neutral',
            score: result.score || 0.5,
            emotion: result.emotion || 'neutral',
            keywords: result.keywords || [],
        };
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
//# sourceMappingURL=ai.service.js.map