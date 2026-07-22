import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'customer' | 'admin';
  };
  token?: string;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Access token missing' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret) as any;
    req.user = payload;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }
}

export function requireRole(role: 'admin' | 'customer') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ success: false, error: `Forbidden: Requires ${role} role` });
      return;
    }
    next();
  };
}
