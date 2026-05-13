"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateValueValidation = exports.generateDescriptionValidation = exports.matchValidation = exports.chatValidation = void 0;
const express_validator_1 = require("express-validator");
exports.chatValidation = [
    (0, express_validator_1.body)('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message must be between 1 and 2000 characters'),
    (0, express_validator_1.body)('context')
        .optional()
        .isString()
        .withMessage('Context must be a string'),
    (0, express_validator_1.body)('propertyId')
        .optional()
        .isUUID()
        .withMessage('Invalid property ID format'),
];
exports.matchValidation = [
    (0, express_validator_1.body)('goal')
        .notEmpty()
        .withMessage('Goal is required')
        .isString()
        .withMessage('Goal must be a string')
        .isLength({ min: 10, max: 500 })
        .withMessage('Goal must be between 10 and 500 characters'),
    (0, express_validator_1.body)('budget')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Budget must be a positive number'),
];
exports.generateDescriptionValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.body)('features')
        .optional()
        .isArray()
        .withMessage('Features must be an array'),
    (0, express_validator_1.body)('features.*')
        .optional()
        .isString()
        .withMessage('Each feature must be a string'),
];
exports.estimateValueValidation = [
    (0, express_validator_1.body)('propertyType')
        .notEmpty()
        .withMessage('Property type is required')
        .isIn(['APARTMENT', 'HOUSE', 'CONDO', 'LAND'])
        .withMessage('Invalid property type'),
    (0, express_validator_1.body)('area')
        .isFloat({ min: 0 })
        .withMessage('Area must be a positive number'),
    (0, express_validator_1.body)('bedrooms')
        .isInt({ min: 0 })
        .withMessage('Bedrooms must be a positive integer'),
    (0, express_validator_1.body)('bathrooms')
        .isInt({ min: 0 })
        .withMessage('Bathrooms must be a positive integer'),
    (0, express_validator_1.body)('location')
        .notEmpty()
        .withMessage('Location is required'),
];
//# sourceMappingURL=ai.validation.js.map