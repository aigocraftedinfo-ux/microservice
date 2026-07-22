import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import productRoutes from './routes/productRoutes.js';
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
      service: 'product-service',
      port: process.env.PRODUCT_SERVICE_PORT || 3002,
      timestamp: new Date().toISOString(),
    });
  });

  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'Microservice for Product Catalog, Search, and Inventory Management',
    },
    paths: {
      '/health': {
        get: { summary: 'Health Check', responses: { '200': { description: 'Service is UP' } } },
      },
      '/api/product/products': {
        get: { summary: 'Get/Filter Products', responses: { '200': { description: 'Products list' } } },
        post: { summary: 'Add Product (Admin)', responses: { '201': { description: 'Product added' } } },
      },
      '/api/product/categories': {
        get: { summary: 'Get Categories', responses: { '200': { description: 'Categories list' } } },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/product', productRoutes);
  app.use(errorHandler);

  return app;
}
