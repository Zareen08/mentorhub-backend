"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewFiltersSchema = exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    bookingId: zod_1.z.string().uuid('Invalid booking ID format'),
    rating: zod_1.z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: zod_1.z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment cannot exceed 500 characters'),
});
exports.updateReviewSchema = exports.createReviewSchema.partial();
exports.reviewFiltersSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(50).default(10),
    rating: zod_1.z.number().int().min(1).max(5).optional(),
    sortBy: zod_1.z.enum(['rating', 'createdAt', 'updatedAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
//# sourceMappingURL=review.interface.js.map