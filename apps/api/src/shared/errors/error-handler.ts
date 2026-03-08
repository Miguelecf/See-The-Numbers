import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Database validation failed',
      errors: err.message,
    });
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format',
    });
  }

  // Mongo duplicate key
  if ((err as any).code === 11000) {
    const duplicatedFields = Object.keys((err as any).keyPattern || {}).join(', ');
    return res.status(409).json({
      status: 'error',
      message: `Duplicate value for: ${duplicatedFields || 'unique field'}`,
    });
  }

  // Unhandled errors
  console.error('Unhandled error:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
