import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { cacheService } from '../../services/cache.service';
import { CreateMentorInput, UpdateMentorInput } from './mentor.interface';
import { Availability } from '@prisma/client';

export class MentorService {
  async getAllMentors(filters: any) {
    const {
      page = 1,
      limit = 10,
      skill,
      minRate,
      maxRate,
      search,
      sortBy = 'rating',
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (skill) {
      where.skills = { has: skill };
    }

    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate.gte = minRate;
      if (maxRate) where.hourlyRate.lte = maxRate;
    }

    if (search) {
      where.user = {
        name: { contains: search, mode: 'insensitive' },
      };
    }

    let orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy = { user: { rating: 'desc' } };
        break;
      case 'price_asc':
        orderBy = { hourlyRate: 'asc' };
        break;
      case 'price_desc':
        orderBy = { hourlyRate: 'desc' };
        break;
      case 'experience':
        orderBy = { experience: 'desc' };
        break;
      default:
        orderBy = { user: { rating: 'desc' } };
    }

    const [mentors, total] = await Promise.all([
      prisma.mentor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              rating: true,
              totalReviews: true,
              bio: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.mentor.count({ where }),
    ]);

    return {
      mentors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getMentorById(id: string) {
    const cacheKey = `mentor:${id}`;
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            rating: true,
            totalReviews: true,
            bio: true,
            expertise: true,
          },
        },
        bookings: {
          where: {
            status: 'COMPLETED',
          },
          take: 5,
          orderBy: { date: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
            review: true,
          },
        },
      },
    });

    if (!mentor) {
      throw new ApiError(404, 'Mentor not found');
    }

    // Calculate average rating from reviews
    const reviews = await prisma.review.findMany({
      where: { mentorId: id },
      select: { rating: true },
    });

    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const result = {
      ...mentor,
      averageRating,
      totalReviews: reviews.length,
    };

    await cacheService.set(cacheKey, result, 300); // Cache for 5 minutes

    return result;
  }

  async createMentor(userId: string, data: CreateMentorInput) {
  const existing = await prisma.mentor.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new ApiError(400, 'User already has a mentor profile');
  }

  // Convert string array to Availability enum array
  const availabilityArray = data.availability as Availability[];

  const mentor = await prisma.mentor.create({
    data: {
      userId,
      title: data.title,
      company: data.company,
      experience: data.experience,
      hourlyRate: data.hourlyRate,
      skills: data.skills,
      availability: availabilityArray,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: 'MENTOR' },
  });

  return mentor;
}

async updateMentor(mentorId: string, data: UpdateMentorInput) {
  const updateData: any = { ...data };
  
  // Convert availability if present
  if (data.availability) {
    updateData.availability = data.availability as Availability[];
  }
  
  const mentor = await prisma.mentor.update({
    where: { id: mentorId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  await cacheService.delete(`mentor:${mentorId}`);

  return mentor;
}


  async getTopMentors(limit: number = 10) {
    const cacheKey = 'top_mentors';
    const cached = await cacheService.get(cacheKey);

    if (cached) {
      return cached;
    }

    const mentors = await prisma.mentor.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            rating: true,
            totalReviews: true,
          },
        },
      },
      orderBy: {
        user: {
          rating: 'desc',
        },
      },
      take: limit,
    });

    await cacheService.set(cacheKey, mentors, 600); // Cache for 10 minutes

    return mentors;
  }

  async getMentorStats(mentorId: string) {
    const stats = await prisma.$transaction([
      prisma.booking.count({
        where: { mentorId, status: 'COMPLETED' },
      }),
      prisma.booking.aggregate({
        where: { mentorId, status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      prisma.review.count({
        where: { mentorId },
      }),
      prisma.review.aggregate({
        where: { mentorId },
        _avg: { rating: true },
      }),
    ]);

    return {
      totalSessions: stats[0],
      totalEarnings: stats[1]._sum.totalAmount || 0,
      totalReviews: stats[2],
      averageRating: stats[3]._avg.rating || 0,
    };
  }
}

export const mentorService = new MentorService();