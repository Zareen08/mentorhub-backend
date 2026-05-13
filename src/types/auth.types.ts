import { Request } from 'express';
import { User, Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}