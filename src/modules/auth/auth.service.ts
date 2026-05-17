import bcrypt from 'bcryptjs';
import { prisma } from '../../config/db';
import { generateToken, generateRefreshToken, verifyToken } from '../../utils/generateToken';
import { ApiError } from '../../utils/ApiError';
import { logger } from '../../utils/logger';
import { queueEmail } from '../../jobs/qstash.service';
import { RegisterInput, LoginInput } from './auth.interface';

export class AuthService {
  async register(data: RegisterInput) {
    const { email, password, name, role: roleInput } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Map frontend role values to Prisma Role enum
    const roleMap: Record<string, 'USER' | 'MENTOR'> = {
      learner: 'USER',
      mentor: 'MENTOR',
      user: 'USER',
    };
    const role = roleMap[roleInput?.toLowerCase() ?? ''] ?? 'USER';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    // Send welcome email (async)
    await queueEmail(user.email, 'Welcome to MentorHub', `Welcome ${user.name}!`).catch(err => {
      logger.error('Failed to send welcome email:', err);
    });

    return { user, accessToken, refreshToken };
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async socialLogin(provider: string, token: string) {
    // In production, verify token with provider (Google, Facebook, etc.)
    // This is a simplified version
    const email = `social_${Date.now()}@${provider}.com`;
    const name = `${provider}_user_${Date.now()}`;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          isVerified: true,
        },
      });
    }

    const accessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!);
    
    if (!decoded) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const newAccessToken = generateToken({ id: user.id, email: user.email, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        expertise: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }
}

export const authService = new AuthService();