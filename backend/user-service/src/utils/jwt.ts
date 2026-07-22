import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { JWTPayload } from '../types/index.js';

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
}
