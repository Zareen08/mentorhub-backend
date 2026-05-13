import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { cacheService } from '../../services/cache.service';
import bcrypt from 'bcryptjs';

export class UserService {
  async getAllUsers(filters: any) {
    const { page = 1, limit = 10, search, role } = filters;
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          isVerified: true,
          createdAt: true,
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
  
  async getUserById(id: string) {
    const cacheKey = `user:${id}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        expertise: true,
        rating: true,
        totalReviews: true,
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
    
    await cacheService.set(cacheKey, user, 600);
    
    return user;
  }
  
  async updateProfile(userId: string, data: any) {
    const { name, bio, expertise, avatar } = data;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        expertise,
        avatar,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        expertise: true,
      },
    });
    
    // Invalidate cache
    await cacheService.delete(`user:${userId}`);
    
    return user;
  }
  
  async updateUserRole(userId: string, role: string, adminId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can update user roles');
    }
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    
    await cacheService.delete(`user:${userId}`);
    
    return user;
  }
  
  async deleteUser(userId: string, adminId: string) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can delete users');
    }
    
    await prisma.user.delete({
      where: { id: userId },
    });
    
    await cacheService.delete(`user:${userId}`);
    
    return { message: 'User deleted successfully' };
  }
  
  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
    
    return bookings;
  }
}

export const userService = new UserService();