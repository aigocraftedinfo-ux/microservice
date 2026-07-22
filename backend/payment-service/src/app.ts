import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import paymentRoutes from './routes/paymentRoutes.js';
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
      service: 'payment-service',
      port: process.env.PAYMENT_SERVICE_PORT || 3005,
      timestamp: new Date().toISOString(),
    });
  });

  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'Microservice for Payment Gateway Processing & Transaction Records',
    },
    paths: {
      '/health': {
        get: { summary: 'Health Check', responses: { '200': { description: 'Service is UP' } } },
      },
      '/api/payment/process': {
        post: { summary: 'Process Fake Payment', responses: { '200': { description: 'Payment Completed' } } },
      },
      '/api/payment/history': {
        get: { summary: 'Get Payment History', responses: { '200': { description: 'Transactions List' } } },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api/payment', paymentRoutes);
  app.use(errorHandler);

  return app;
}
