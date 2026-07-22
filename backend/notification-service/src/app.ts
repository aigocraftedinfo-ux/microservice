import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import notificationRoutes from './routes/notificationRoutes.js';
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
      service: 'notification-service',
      port: process.env.NOTIFICATION_SERVICE_PORT || 3006,
      timestamp: new Date().toISOString(),
    });
  });

  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'Microservice for Asynchronous Notification Logs & Email Dispatch Simulations',
    },
    paths: {
      '/health': {
        get: { summary: 'Health Check', responses: { '200': { description: 'Service is UP' } } },
      },
      '/api/notification/send': {
        post: { summary: 'Send Log Notification', responses: { '201': { description: 'Notification Recorded' } } },
      },
      '/api/notification/logs': {
        get: { summary: 'Get Notification Logs', responses: { '200': { description: 'Logs List' } } },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/notification', notificationRoutes);
  app.use(errorHandler);

  return app;
}
