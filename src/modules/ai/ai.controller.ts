import { Request, Response } from 'express';
import { aiService } from './ai.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class AIController {
  getRecommendations = catchAsync(async (req: AuthRequest, res: Response) => {
    const recommendations = await aiService.getMentorRecommendations(req.user!.id);
    sendResponse(res, 200, true, 'AI recommendations generated (Powered by Gemini)', recommendations);
  });

  chat = catchAsync(async (req: AuthRequest, res: Response) => {
    const { message, context } = req.body;
    const response = await aiService.chat(req.user!.id, message, context);
    sendResponse(res, 200, true, 'AI response generated (Powered by Gemini)', response);
  });

  matchMentor = catchAsync(async (req: AuthRequest, res: Response) => {
    const { goal, budget } = req.body;
    const matches = await aiService.findBestMentorMatch(req.user!.id, goal, budget);
    sendResponse(res, 200, true, 'AI matching completed (Powered by Gemini)', matches);
  });

  getInsights = catchAsync(async (req: Request, res: Response) => {
    const insights = await aiService.getMarketInsights();
    sendResponse(res, 200, true, 'Market insights generated (Powered by Gemini)', insights);
  });

  generateSummary = catchAsync(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const summary = await aiService.generateSessionSummary(bookingId);
    sendResponse(res, 200, true, 'Session summary generated (Powered by Gemini)', { summary });
  });

  analyzeSentiment = catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;
    const sentiment = await aiService.analyzeSentiment(text);
    sendResponse(res, 200, true, 'Sentiment analysis completed (Powered by Gemini)', sentiment);
  });
}

export const aiController = new AIController();