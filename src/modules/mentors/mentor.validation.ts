import { body } from 'express-validator';

export const createMentorValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters'),
  
  body('company')
    .optional()
    .isString()
    .withMessage('Company must be a string'),
  
  body('experience')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be between 0 and 50 years'),
  
  body('hourlyRate')
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number'),
  
  body('skills')
    .isArray()
    .withMessage('Skills must be an array')
    .custom((value) => value.length > 0)
    .withMessage('At least one skill is required'),
  
  body('availability')
    .isArray()
    .withMessage('Availability must be an array'),
  
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string'),
];

export const updateMentorValidation = createMentorValidation.map(validation => 
  validation.optional()
);