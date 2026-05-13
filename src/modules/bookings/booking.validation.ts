import { body, param } from 'express-validator';

export const createBookingValidation = [
  body('mentorId')
    .notEmpty()
    .withMessage('Mentor ID is required')
    .isUUID()
    .withMessage('Invalid mentor ID format'),
  
  body('date')
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
  
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isInt({ min: 30, max: 240 })
    .withMessage('Duration must be between 30 and 240 minutes'),
  
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const updateBookingValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid booking ID format'),
  
  body('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
    .withMessage('Invalid status value'),
  
  body('date')
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

export const cancelBookingValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid booking ID format'),
  
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
];