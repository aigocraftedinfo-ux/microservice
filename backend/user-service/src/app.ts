import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createServiceApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Health endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'user-service',
      port: process.env.USER_SERVICE_PORT || 3001,
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger Documentation Object
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'Microservice for User Registration, Authentication, and Profile Management',
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health Check',
          responses: { '200': { description: 'Service is UP' } },
        },
      },
      '/api/user/register': {
        post: {
          summary: 'Register new user',
          requestBody: { required: true },
          responses: { '201': { description: 'User created successfully' } },
        },
      },
      '/api/user/login': {
        post: {
          summary: 'User Login',
          requestBody: { required: true },
          responses: { '200': { description: 'Login successful' } },
        },
      },
      '/api/user/profile': {
        get: {
          summary: 'Get Profile',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Profile fetched' } },
        },
      },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Mount API routes
  app.use('/api/user', userRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
}
