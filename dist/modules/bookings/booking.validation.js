"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingValidation = exports.updateBookingValidation = exports.createBookingValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createBookingValidation = [
    (0, express_validator_1.body)('mentorId')
        .notEmpty()
        .withMessage('Mentor ID is required')
        .isUUID()
        .withMessage('Invalid mentor ID format'),
    (0, express_validator_1.body)('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
        const date = new Date(value);
        if (date < new Date()) {
            throw new Error('Date must be in the future');
        }
        return true;
    }),
    (0, express_validator_1.body)('duration')
        .notEmpty()
        .withMessage('Duration is required')
        .isInt({ min: 30, max: 240 })
        .withMessage('Duration must be between 30 and 240 minutes'),
    (0, express_validator_1.body)('notes')
        .optional()
        .isString()
        .withMessage('Notes must be a string')
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters'),
];
exports.updateBookingValidation = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid booking ID format'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
        .withMessage('Invalid status value'),
    (0, express_validator_1.body)('date')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
        const date = new Date(value);
        if (date < new Date()) {
            throw new Error('Date must be in the future');
        }
        return true;
    }),
];
exports.cancelBookingValidation = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid booking ID format'),
    (0, express_validator_1.body)('reason')
        .optional()
        .isString()
        .withMessage('Reason must be a string')
        .isLength({ max: 500 })
        .withMessage('Reason cannot exceed 500 characters'),
];
//# sourceMappingURL=booking.validation.js.map