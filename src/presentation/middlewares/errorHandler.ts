import { Request, Response, NextFunction } from 'express';
import Logger from '../../infrastructure/logging/Logger'; // Adjust path as necessary

// Custom error classes
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message: string = 'Validation Error') {
    super(message, 400);
  }
}

// Global error handler middleware
const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Something went wrong';

  // Log the error
  Logger.error({
    message: err.message,
    statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Send response
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Internal Server Error' : message,
  });
};

// Middleware to handle 404 errors (this should be placed after all your routes)
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('The requested resource was not found'));
};

export { errorHandler, notFoundHandler, AppError, NotFoundError, ValidationError };

