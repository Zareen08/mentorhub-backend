import { Request, Response } from 'express';
import { userService } from './user.service';
import { AuthRequest } from '../../types/auth.types';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

export class UserController {
  getAllUsers = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await userService.getAllUsers(req.query);
    sendResponse(res, 200, true, 'Users fetched successfully', result);
  });
  
  getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, 200, true, 'User fetched successfully', user);
  });
  
  getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    sendResponse(res, 200, true, 'Profile fetched successfully', user);
  });
  
  updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.updateProfile(req.user!.id, req.body);
    sendResponse(res, 200, true, 'Profile updated successfully', user);
  });
  
  updateUserRole = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await userService.updateUserRole(id, role, req.user!.id);
    sendResponse(res, 200, true, 'User role updated successfully', user);
  });
  
  deleteUser = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await userService.deleteUser(id, req.user!.id);
    sendResponse(res, 200, true, 'User deleted successfully', null);
  });
  
  getUserBookings = catchAsync(async (req: AuthRequest, res: Response) => {
    const bookings = await userService.getUserBookings(req.user!.id);
    sendResponse(res, 200, true, 'Your bookings fetched successfully', bookings);
  });
}

export const userController = new UserController();