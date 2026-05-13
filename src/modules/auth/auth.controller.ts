import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class AuthController {
  register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendResponse(res, 201, true, 'Registration successful', result);
  });

  login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendResponse(res, 200, true, 'Login successful', result);
  });

  socialLogin = catchAsync(async (req: Request, res: Response) => {
    const { provider, token } = req.body;
    const result = await authService.socialLogin(provider, token);
    sendResponse(res, 200, true, 'Social login successful', result);
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    sendResponse(res, 200, true, 'Token refreshed', result);
  });

  changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user!.id, currentPassword, newPassword);
    sendResponse(res, 200, true, result.message, null);
  });

  getCurrentUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await authService.getCurrentUser(req.user!.id);
    sendResponse(res, 200, true, 'User fetched', user);
  });

  logout = catchAsync(async (req: AuthRequest, res: Response) => {
    // In production, you might want to blacklist the token
    sendResponse(res, 200, true, 'Logged out successfully', null);
  });
}

export const authController = new AuthController();