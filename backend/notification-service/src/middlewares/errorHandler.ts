import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[Notification-Service Error]:', err);

  if (err instanceof ZodError) {
    const issues = err.issues || (err as any).errors || [];
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: issues.map((e: any) => ({ field: Array.isArray(e.path) ? e.path.join('.') : '', message: e.message })),
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
