import { createServiceApp } from './app.js';
import { config } from './config/index.js';

const app = createServiceApp();
const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Notification-Service] Running on port ${PORT}`);
  });
}

export default app;
