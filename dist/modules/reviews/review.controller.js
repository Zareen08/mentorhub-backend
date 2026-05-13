"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const review_service_1 = require("./review.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
class ReviewController {
    createReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { bookingId, rating, comment } = req.body;
        const review = await review_service_1.reviewService.createReview(req.user.id, bookingId, rating, comment);
        (0, sendResponse_1.sendResponse)(res, 201, true, 'Review created successfully', review);
    });
    getMentorReviews = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { mentorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const rating = req.query.rating ? parseInt(req.query.rating) : undefined;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const result = await review_service_1.reviewService.getMentorReviews(mentorId, {
            page,
            limit,
            rating,
            sortBy,
            sortOrder,
        });
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Reviews fetched successfully', result);
    });
    getUserReviews = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const reviews = await review_service_1.reviewService.getUserReviews(req.user.id);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Your reviews fetched successfully', reviews);
    });
    getReviewStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { mentorId } = req.params;
        const stats = await review_service_1.reviewService.getReviewStats(mentorId);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Review statistics fetched', stats);
    });
    getReviewAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { mentorId } = req.params;
        const analytics = await review_service_1.reviewService.getReviewAnalytics(mentorId);
        (0, sendResponse_1.sendResponse)(res, 200, true, 'Review analytics fetched', analytics);
    });
    deleteReview = (0, catchAsync_1.catchAsync)(async (req, res) => {
        const { id } = req.params;
        const isAdmin = req.user?.role === 'ADMIN';
        const result = await review_service_1.reviewService.deleteReview(id, req.user.id, isAdmin);
        (0, sendResponse_1.sendResponse)(res, 200, true, result.message, null);
    });
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
//# sourceMappingURL=review.controller.js.map