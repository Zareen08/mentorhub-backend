import { body, param, query } from 'express-validator';

export const updateProfileValidation = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string')
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('expertise')
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),
  
  body('expertise.*')
    .optional()
    .isString()
    .withMessage('Each expertise must be a string'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
];

export const changeUserRoleValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['USER', 'MENTOR', 'ADMIN'])
    .withMessage('Invalid role value'),
];

export const userIdParamValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
];

export const userQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
  
  query('role')
    .optional()
    .isIn(['USER', 'MENTOR', 'ADMIN'])
    .withMessage('Invalid role value'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];