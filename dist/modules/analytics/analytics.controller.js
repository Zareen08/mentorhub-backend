"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsController = exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class AnalyticsController {
    getPlatformStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const stats = await analytics_service_1.analyticsService.getPlatformStats();
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Platform statistics fetched', stats);
    });
    getMentorAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const mentorId = req.params.mentorId || req.user?.id;
        const stats = await analytics_service_1.analyticsService.getMentorAnalytics(mentorId);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Mentor analytics fetched', stats);
    });
    getBookingTrends = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const days = parseInt(req.query.days) || 30;
        const trends = await analytics_service_1.analyticsService.getBookingTrends(days);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Booking trends fetched', trends);
    });
    getTopMentors = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const topMentors = await analytics_service_1.analyticsService.getTopMentors(limit);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Top mentors fetched', topMentors);
    });
}
exports.AnalyticsController = AnalyticsController;
exports.analyticsController = new AnalyticsController();
//# sourceMappingURL=analytics.controller.js.map