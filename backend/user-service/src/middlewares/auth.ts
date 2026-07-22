import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { JWTPayload } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Access token is missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
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
