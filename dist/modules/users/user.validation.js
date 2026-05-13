"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryValidation = exports.userIdParamValidation = exports.changeUserRoleValidation = exports.updateProfileValidation = void 0;
const express_validator_1 = require("express-validator");
exports.updateProfileValidation = [
    (0, express_validator_1.body)('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('bio')
        .optional()
        .isString()
        .withMessage('Bio must be a string')
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters'),
    (0, express_validator_1.body)('expertise')
        .optional()
        .isArray()
        .withMessage('Expertise must be an array'),
    (0, express_validator_1.body)('expertise.*')
        .optional()
        .isString()
        .withMessage('Each expertise must be a string'),
    (0, express_validator_1.body)('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
];
exports.changeUserRoleValidation = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid user ID format'),
    (0, express_validator_1.body)('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['USER', 'MENTOR', 'ADMIN'])
        .withMessage('Invalid role value'),
];
exports.userIdParamValidation = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid user ID format'),
];
exports.userQueryValidation = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('search')
        .optional()
        .isString()
        .withMessage('Search must be a string'),
    (0, express_validator_1.query)('role')
        .optional()
        .isIn(['USER', 'MENTOR', 'ADMIN'])
        .withMessage('Invalid role value'),
    (0, express_validator_1.query)('sortBy')
        .optional()
        .isIn(['name', 'email', 'createdAt', 'updatedAt'])
        .withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
];
//# sourceMappingURL=user.validation.js.map