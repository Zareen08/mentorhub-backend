export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Data fetched successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    REGISTER: 'Registration successful',
  },
  
  // Error Messages
  ERROR: {
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    BAD_REQUEST: 'Invalid request',
    INTERNAL_ERROR: 'Internal server error',
    DUPLICATE: 'Resource already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
  },
  
  // Validation Messages
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL: 'Invalid email format',
    MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
    MAX_LENGTH: (field: string, max: number) => `${field} must be at most ${max} characters`,
  },
  
  // AI Messages
  AI: {
    PROCESSING: 'AI is processing your request',
    COMPLETED: 'AI processing completed',
    FAILED: 'AI processing failed',
  },
};