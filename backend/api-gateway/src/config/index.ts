import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
    cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
  },
};
