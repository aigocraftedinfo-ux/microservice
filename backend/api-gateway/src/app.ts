import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import swaggerUi from 'swagger-ui-express';
import gatewayRoutes from './routes/gatewayRoutes.js';
import { config } from './config/index.js';

export function createGatewayApp() {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(morgan('dev'));

  // Aggregated Swagger Docs
  const aggregatedSwagger = {
    openapi: '3.0.0',
    info: {
      title: 'Amazon Microservices - Unified API Gateway',
      version: '1.0.0',
      description: 'API Gateway aggregating User, Product, Cart, Order, Payment, and Notification microservices.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'API Gateway' }],
    paths: {
      '/health': { get: { summary: 'Cluster Health Check', responses: { '200': { description: 'Status' } } } },
      '/dashboard': { get: { summary: 'Microservice Monitoring Dashboard', responses: { '200': { description: 'Metrics' } } } },
      '/api/user/register': { post: { summary: 'Register User [User Service]' } },
      '/api/user/login': { post: { summary: 'User Login [User Service]' } },
      '/api/product/products': { get: { summary: 'Get Products [Product Service]' } },
      '/api/cart': { get: { summary: 'Get Cart [Cart Service]' } },
      '/api/order/checkout': { post: { summary: 'Checkout Order [Order Service]' } },
      '/api/payment/process': { post: { summary: 'Process Fake Payment [Payment Service]' } },
      '/api/notification/logs': { get: { summary: 'Notification Logs [Notification Service]' } },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(aggregatedSwagger));

  // Health and Dashboard endpoints
  app.use('/', gatewayRoutes);

  // Microservice Proxy Route mappings
  app.use('/api/user', proxy(config.services.user, { proxyReqPathResolver: (req) => `/api/user${req.url}` }));
  app.use('/api/product', proxy(config.services.product, { proxyReqPathResolver: (req) => `/api/product${req.url}` }));
  app.use('/api/cart', proxy(config.services.cart, { proxyReqPathResolver: (req) => `/api/cart${req.url}` }));
  app.use('/api/order', proxy(config.services.order, { proxyReqPathResolver: (req) => `/api/order${req.url}` }));
  app.use('/api/payment', proxy(config.services.payment, { proxyReqPathResolver: (req) => `/api/payment${req.url}` }));
  app.use('/api/notification', proxy(config.services.notification, { proxyReqPathResolver: (req) => `/api/notification${req.url}` }));

  return app;
}
