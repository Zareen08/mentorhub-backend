"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const router = (0, express_1.Router)();
// All AI routes are protected and rate-limited
router.use(auth_middleware_1.authenticate);
router.use(rateLimit_middleware_1.rateLimitMiddleware);
// AI Feature Routes (All FREE with Google Gemini)
router.get('/recommendations', ai_controller_1.aiController.getRecommendations);
router.post('/chat', ai_controller_1.aiController.chat);
router.post('/match', ai_controller_1.aiController.matchMentor);
router.get('/insights', (0, auth_middleware_1.authorize)('ADMIN'), ai_controller_1.aiController.getInsights);
router.get('/summary/:bookingId', ai_controller_1.aiController.generateSummary);
router.post('/sentiment', ai_controller_1.aiController.analyzeSentiment);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map