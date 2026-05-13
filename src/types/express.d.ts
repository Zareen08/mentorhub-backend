import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: Role;
      avatar: string | null;
      isVerified: boolean;
      bio?: string | null;
      expertise?: string[];
      rating?: number;
      totalReviews?: number;
    }

    interface Request {
      user?: User;
      files?: Express.Multer.File[];
      file?: Express.Multer.File;
      userId?: string;
      requestId?: string;
      startTime?: number;
    }

    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

export interface PaginatedRequest extends Express.Request {
  pagination?: {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export interface AuthenticatedRequest extends Express.Request {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface FileUploadRequest extends AuthenticatedRequest {
  file: Express.Multer.File;
}

export interface MultipleFileUploadRequest extends AuthenticatedRequest {
  files: Express.Multer.File[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
  senderId?: string;
  receiverId?: string;
}

export interface NotificationPayload {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'REVIEW' | 'SYSTEM' | 'MENTOR_MATCH' | 'REMINDER';
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export interface AuthPaginatedRequest extends PaginatedRequest {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar: string | null;
    isVerified: boolean;
  };
}

export {};
