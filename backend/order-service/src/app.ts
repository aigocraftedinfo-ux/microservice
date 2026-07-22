import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createServiceApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'order-service',
      port: process.env.ORDER_SERVICE_PORT || 3004,
      timestamp: new Date().toISOString(),
    });
  });

  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'Microservice for Order Processing, Checkout, and Tracking',
    },
    paths: {
      '/health': {
        get: { summary: 'Health Check', responses: { '200': { description: 'Service is UP' } } },
      },
      '/api/order/checkout': {
        post: { summary: 'Checkout and Create Order', responses: { '201': { description: 'Order Created' } } },
      },
      '/api/order/my-orders': {
        get: { summary: 'Get My Orders', responses: { '200': { description: 'User Orders List' } } },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/order', orderRoutes);
  app.use(errorHandler);

  return app;
}
