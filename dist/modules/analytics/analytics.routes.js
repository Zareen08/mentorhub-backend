"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public stats (limited)
router.get('/platform', analytics_controller_1.analyticsController.getPlatformStats);
router.get('/top-mentors', analytics_controller_1.analyticsController.getTopMentors);
router.get('/booking-trends', analytics_controller_1.analyticsController.getBookingTrends);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.get('/mentor/:mentorId?', (0, auth_middleware_1.authorize)('MENTOR', 'ADMIN'), analytics_controller_1.analyticsController.getMentorAnalytics);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map