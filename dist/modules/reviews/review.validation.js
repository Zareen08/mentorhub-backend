"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createReviewValidation = [
    (0, express_validator_1.body)('bookingId')
        .notEmpty()
        .withMessage('Booking ID is required')
        .isUUID()
        .withMessage('Invalid booking ID format'),
    (0, express_validator_1.body)('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    (0, express_validator_1.body)('comment')
        .notEmpty()
        .withMessage('Comment is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters'),
];
//# sourceMappingURL=review.validation.js.map