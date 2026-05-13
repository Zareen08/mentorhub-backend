"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMentorValidation = exports.createMentorValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createMentorValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Title must be between 2 and 100 characters'),
    (0, express_validator_1.body)('company')
        .optional()
        .isString()
        .withMessage('Company must be a string'),
    (0, express_validator_1.body)('experience')
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),
    (0, express_validator_1.body)('hourlyRate')
        .isFloat({ min: 0 })
        .withMessage('Hourly rate must be a positive number'),
    (0, express_validator_1.body)('skills')
        .isArray()
        .withMessage('Skills must be an array')
        .custom((value) => value.length > 0)
        .withMessage('At least one skill is required'),
    (0, express_validator_1.body)('availability')
        .isArray()
        .withMessage('Availability must be an array'),
    (0, express_validator_1.body)('bio')
        .optional()
        .isString()
        .withMessage('Bio must be a string'),
];
exports.updateMentorValidation = exports.createMentorValidation.map(validation => validation.optional());
//# sourceMappingURL=mentor.validation.js.map