import { Response } from 'express';
import { reviewService } from './review.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class ReviewController {
  createReview = catchAsync(async (req: AuthRequest, res: Response) => {
    const { bookingId, rating, comment } = req.body;
    const review = await reviewService.createReview(req.user!.id, bookingId, rating, comment);
    sendResponse(res, 201, true, 'Review created successfully', review);
  });
  
  getMentorReviews = catchAsync(async (req: AuthRequest, res: Response) => {
    const { mentorId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    
    const result = await reviewService.getMentorReviews(mentorId, {
      page,
      limit,
      rating,
      sortBy,
      sortOrder,
    });
    
    sendResponse(res, 200, true, 'Reviews fetched successfully', result);
  });
  
  getUserReviews = catchAsync(async (req: AuthRequest, res: Response) => {
    const reviews = await reviewService.getUserReviews(req.user!.id);
    sendResponse(res, 200, true, 'Your reviews fetched successfully', reviews);
  });
  
  getReviewStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const { mentorId } = req.params;
    const stats = await reviewService.getReviewStats(mentorId);
    sendResponse(res, 200, true, 'Review statistics fetched', stats);
  });
  
  getReviewAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
    const { mentorId } = req.params;
    const analytics = await reviewService.getReviewAnalytics(mentorId);
    sendResponse(res, 200, true, 'Review analytics fetched', analytics);
  });
  
  deleteReview = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';
    const result = await reviewService.deleteReview(id, req.user!.id, isAdmin);
    sendResponse(res, 200, true, result.message, null);
  });
}

export const reviewController = new ReviewController();