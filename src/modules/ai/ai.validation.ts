import { body } from 'express-validator';

export const chatValidation = [
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isString()
    .withMessage('Message must be a string')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  
  body('context')
    .optional()
    .isString()
    .withMessage('Context must be a string'),
  
  body('propertyId')
    .optional()
    .isUUID()
    .withMessage('Invalid property ID format'),
];

export const matchValidation = [
  body('goal')
    .notEmpty()
    .withMessage('Goal is required')
    .isString()
    .withMessage('Goal must be a string')
    .isLength({ min: 10, max: 500 })
    .withMessage('Goal must be between 10 and 500 characters'),
  
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
];

export const generateDescriptionValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('features.*')
    .optional()
    .isString()
    .withMessage('Each feature must be a string'),
];

export const estimateValueValidation = [
  body('propertyType')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn(['APARTMENT', 'HOUSE', 'CONDO', 'LAND'])
    .withMessage('Invalid property type'),
  
  body('area')
    .isFloat({ min: 0 })
    .withMessage('Area must be a positive number'),
  
  body('bedrooms')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a positive integer'),
  
  body('bathrooms')
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a positive integer'),
  
  body('location')
    .notEmpty()
    .withMessage('Location is required'),
];