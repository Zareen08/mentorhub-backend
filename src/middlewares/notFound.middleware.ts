import { Request, Response } from 'express';

export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.path}`,
    message: 'Route not found',
    timestamp: new Date().toISOString(),
  });
};