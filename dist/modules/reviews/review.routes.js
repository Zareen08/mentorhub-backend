"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/mentor/:mentorId', review_controller_1.reviewController.getMentorReviews);
// Protected routes
router.use(auth_middleware_1.authenticate);
router.post('/', review_controller_1.reviewController.createReview);
router.get('/my-reviews', review_controller_1.reviewController.getUserReviews);
exports.default = router;
//# sourceMappingURL=review.routes.js.map