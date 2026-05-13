"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AIController = void 0;
const ai_service_1 = require("./ai.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class AIController {
    getRecommendations = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const recommendations = await ai_service_1.aiService.getMentorRecommendations(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'AI recommendations generated (Powered by Gemini)', recommendations);
    });
    chat = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { message, context } = req.body;
        const response = await ai_service_1.aiService.chat(req.user.id, message, context);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'AI response generated (Powered by Gemini)', response);
    });
    matchMentor = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { goal, budget } = req.body;
        const matches = await ai_service_1.aiService.findBestMentorMatch(req.user.id, goal, budget);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'AI matching completed (Powered by Gemini)', matches);
    });
    getInsights = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const insights = await ai_service_1.aiService.getMarketInsights();
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Market insights generated (Powered by Gemini)', insights);
    });
    generateSummary = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { bookingId } = req.params;
        const summary = await ai_service_1.aiService.generateSessionSummary(bookingId);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Session summary generated (Powered by Gemini)', { summary });
    });
    analyzeSentiment = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { text } = req.body;
        const sentiment = await ai_service_1.aiService.analyzeSentiment(text);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Sentiment analysis completed (Powered by Gemini)', sentiment);
    });
}
exports.AIController = AIController;
exports.aiController = new AIController();
//# sourceMappingURL=ai.controller.js.map