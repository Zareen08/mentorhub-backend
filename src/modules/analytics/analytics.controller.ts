import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class AnalyticsController {
  getPlatformStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await analyticsService.getPlatformStats();
    sendResponse(res, 200, true, 'Platform statistics fetched', stats);
  });
  
  getMentorAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
    const mentorId = req.params.mentorId || req.user?.id;
    const stats = await analyticsService.getMentorAnalytics(mentorId!);
    sendResponse(res, 200, true, 'Mentor analytics fetched', stats);
  });
  
  getBookingTrends = catchAsync(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const trends = await analyticsService.getBookingTrends(days);
    sendResponse(res, 200, true, 'Booking trends fetched', trends);
  });
  
  getTopMentors = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const topMentors = await analyticsService.getTopMentors(limit);
    sendResponse(res, 200, true, 'Top mentors fetched', topMentors);
  });
}

export const analyticsController = new AnalyticsController();