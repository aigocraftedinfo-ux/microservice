import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

// Import Service App Creators
import { createServiceApp as createUserApp } from './backend/user-service/src/app.js';
import { createServiceApp as createProductApp } from './backend/product-service/src/app.js';
import { createServiceApp as createCartApp } from './backend/cart-service/src/app.js';
import { createServiceApp as createOrderApp } from './backend/order-service/src/app.js';
import { createServiceApp as createPaymentApp } from './backend/payment-service/src/app.js';
import { createServiceApp as createNotificationApp } from './backend/notification-service/src/app.js';
import { createGatewayApp } from './backend/api-gateway/src/app.js';

async function startMicroservicesCluster() {
  console.log('🚀 Bootstrapping Amazon Microservices Architecture Cluster...');

  // 1. Boot individual microservices on independent internal ports
  const userApp = createUserApp();
  userApp.listen(3001, '0.0.0.0', () => console.log('  [User Service] Running on http://0.0.0.0:3001'));

  const productApp = createProductApp();
  productApp.listen(3002, '0.0.0.0', () => console.log('  [Product Service] Running on http://0.0.0.0:3002'));

  const cartApp = createCartApp();
  cartApp.listen(3003, '0.0.0.0', () => console.log('  [Cart Service] Running on http://0.0.0.0:3003'));

  const orderApp = createOrderApp();
  orderApp.listen(3004, '0.0.0.0', () => console.log('  [Order Service] Running on http://0.0.0.0:3004'));

  const paymentApp = createPaymentApp();
  paymentApp.listen(3005, '0.0.0.0', () => console.log('  [Payment Service] Running on http://0.0.0.0:3005'));

  const notificationApp = createNotificationApp();
  notificationApp.listen(3006, '0.0.0.0', () => console.log('  [Notification Service] Running on http://0.0.0.0:3006'));

  // 2. Initialize Gateway App on Port 3000
  const gatewayApp = createGatewayApp();

  // 3. Attach Vite frontend middleware / static file server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    gatewayApp.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    gatewayApp.use(express.static(distPath));
    gatewayApp.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Listen on Gateway Port 3000
  const PORT = 3000;
  gatewayApp.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ [API Gateway + Frontend] Cluster Online on http://localhost:${PORT}`);
    console.log(`📊 Microservice Health Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`📖 Aggregated Swagger Docs: http://localhost:${PORT}/api/docs\n`);
  });
}

startMicroservicesCluster().catch((err) => {
  console.error('❌ Cluster Boot Failed:', err);
  process.exit(1);
});
