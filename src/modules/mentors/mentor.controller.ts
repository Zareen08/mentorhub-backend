import { Request, Response } from 'express';
import { mentorService } from './mentor.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class MentorController {
  getAllMentors = catchAsync(async (req: Request, res: Response) => {
    const result = await mentorService.getAllMentors(req.query);
    sendResponse(res, 200, true, 'Mentors fetched successfully', result);
  });

  getMentorById = catchAsync(async (req: Request, res: Response) => {
    const mentor = await mentorService.getMentorById(req.params.id);
    sendResponse(res, 200, true, 'Mentor fetched successfully', mentor);
  });

  createMentor = catchAsync(async (req: AuthRequest, res: Response) => {
    const mentor = await mentorService.createMentor(req.user!.id, req.body);
    sendResponse(res, 201, true, 'Mentor profile created successfully', mentor);
  });

  updateMentor = catchAsync(async (req: AuthRequest, res: Response) => {
    const mentor = await mentorService.updateMentor(req.params.id, req.body);
    sendResponse(res, 200, true, 'Mentor profile updated successfully', mentor);
  });

  getTopMentors = catchAsync(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const mentors = await mentorService.getTopMentors(limit);
    sendResponse(res, 200, true, 'Top mentors fetched', mentors);
  });

  getMentorStats = catchAsync(async (req: AuthRequest, res: Response) => {
    const stats = await mentorService.getMentorStats(req.params.id);
    sendResponse(res, 200, true, 'Mentor stats fetched', stats);
  });
}

export const mentorController = new MentorController();