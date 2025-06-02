import { Request, Response, NextFunction } from 'express';

/**
 * Error response interface for consistent error formatting
 */
interface ErrorResponse {
  status: number;
  message: string;
  stack?: string;
  errors?: any;
  timestamp: string;
  path: string;
}

/**
 * Custom API Error class with status code
 */
export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found Error Handler - Converts 404 errors to proper API responses
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Resource not found - ${req.originalUrl}`);
  next(error);
};

/**
 * Global Error Handler - Provides consistent error responses
 */
export const globalErrorHandler = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const errors = 'errors' in err ? err.errors : undefined;
  
  const errorResponse: ErrorResponse = {
    status: statusCode,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Include validation errors if available
  if (errors) {
    errorResponse.errors = errors;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Async Handler - Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};