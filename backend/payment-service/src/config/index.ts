import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PAYMENT_SERVICE_PORT || '3005', 10),
  jwtSecret: process.env.JWT_SECRET || 'amazon_super_secret_jwt_key_2026',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};
