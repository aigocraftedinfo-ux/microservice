import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.ORDER_SERVICE_PORT || '3004', 10),
  jwtSecret: process.env.JWT_SECRET || 'amazon_super_secret_jwt_key_2026',
  cartServiceUrl: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
};
