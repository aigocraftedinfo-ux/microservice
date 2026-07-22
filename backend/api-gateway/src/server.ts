import { createGatewayApp } from './app.js';
import { config } from './config/index.js';

const app = createGatewayApp();
const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[API-Gateway] Listening on port ${PORT}`);
  });
}

export default app;
