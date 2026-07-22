import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cartRoutes from './routes/cartRoutes.js';
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
      service: 'cart-service',
      port: process.env.CART_SERVICE_PORT || 3003,
      timestamp: new Date().toISOString(),
    });
  });

  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Cart Service API',
      version: '1.0.0',
      description: 'Microservice for User Cart Management and Items Operations',
    },
    paths: {
      '/health': {
        get: { summary: 'Health Check', responses: { '200': { description: 'Service is UP' } } },
      },
      '/api/cart': {
        get: { summary: 'Get Cart', responses: { '200': { description: 'Cart Object' } } },
      },
      '/api/cart/add': {
        post: { summary: 'Add Item to Cart', responses: { '200': { description: 'Item added' } } },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/cart', cartRoutes);
  app.use(errorHandler);

  return app;
}
