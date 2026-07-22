import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.CART_SERVICE_PORT || '3003', 10),
  jwtSecret: process.env.JWT_SECRET || 'amazon_super_secret_jwt_key_2026',
  productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
};
