import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'An unexpected internal server error occurred';

  // In non-production environments, log details for debugging
  if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'test') {
    console.error('API Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    // Never leak stack traces or internal errors in production responses
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
