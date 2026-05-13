"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const mentor_routes_1 = __importDefault(require("../modules/mentors/mentor.routes"));
const booking_routes_1 = __importDefault(require("../modules/bookings/booking.routes"));
const review_routes_1 = __importDefault(require("../modules/reviews/review.routes"));
const ai_routes_1 = __importDefault(require("../modules/ai/ai.routes"));
const upload_routes_1 = __importDefault(require("../modules/uploads/upload.routes"));
const notification_routes_1 = __importDefault(require("../modules/notifications/notification.routes"));
const analytics_routes_1 = __importDefault(require("../modules/analytics/analytics.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});
// API version info
router.get('/', (req, res) => {
    res.json({
        name: 'MentorHub API',
        version: '1.0.0',
        description: 'AI-powered mentorship platform API',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    });
});
// Public routes (no authentication required)
router.use('/auth', auth_routes_1.default);
router.use('/mentors', mentor_routes_1.default);
router.use('/analytics', analytics_routes_1.default);
// Protected routes (authentication required)
router.use('/users', user_routes_1.default);
router.use('/bookings', booking_routes_1.default);
router.use('/reviews', review_routes_1.default);
router.use('/ai', ai_routes_1.default);
router.use('/uploads', upload_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map