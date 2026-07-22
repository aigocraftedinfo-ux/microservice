import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.USER_SERVICE_PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'amazon_super_secret_jwt_key_2026',
  jwtExpiresIn: '7d',
};
