import axios from 'axios';
import { config } from '../config/index.js';

export interface ServiceHealthReport {
  service: string;
  url: string;
  status: 'UP' | 'DOWN';
  responseTimeMs: number;
  lastChecked: string;
  error?: string;
}

export class GatewayService {
  public async pingService(name: string, url: string): Promise<ServiceHealthReport> {
    const startTime = Date.now();
    try {
      const res = await axios.get(`${url}/health`, { timeout: 3000 });
      const responseTimeMs = Date.now() - startTime;
      return {
        service: name,
        url,
        status: res.data.status === 'UP' ? 'UP' : 'DOWN',
        responseTimeMs,
        lastChecked: new Date().toISOString(),
      };
    } catch (err: any) {
      const responseTimeMs = Date.now() - startTime;
      return {
        service: name,
        url,
        status: 'DOWN',
        responseTimeMs,
        lastChecked: new Date().toISOString(),
        error: err.message || 'Service unreachable',
      };
    }
  }

  public async getDashboardMetrics() {
    const serviceEntries = Object.entries(config.services);
    const healthChecks = await Promise.all(
      serviceEntries.map(([name, url]) => this.pingService(name, url))
    );

    const availableAPIs = [
      { service: 'User Service', endpoint: '/api/user/register', method: 'POST', description: 'Register new user account' },
      { service: 'User Service', endpoint: '/api/user/login', method: 'POST', description: 'Authenticate user and receive JWT' },
      { service: 'User Service', endpoint: '/api/user/profile', method: 'GET', description: 'Fetch user profile' },
      { service: 'Product Service', endpoint: '/api/product/products', method: 'GET', description: 'Search, filter, and list catalog products' },
      { service: 'Product Service', endpoint: '/api/product/products/:id', method: 'GET', description: 'Get detailed product information' },
      { service: 'Product Service', endpoint: '/api/product/categories', method: 'GET', description: 'Fetch product categories' },
      { service: 'Cart Service', endpoint: '/api/cart', method: 'GET', description: 'Retrieve user active shopping cart' },
      { service: 'Cart Service', endpoint: '/api/cart/add', method: 'POST', description: 'Add product line item to cart' },
      { service: 'Order Service', endpoint: '/api/order/checkout', method: 'POST', description: 'Process checkout and place order' },
      { service: 'Order Service', endpoint: '/api/order/my-orders', method: 'GET', description: 'Retrieve user purchase history' },
      { service: 'Payment Service', endpoint: '/api/payment/process', method: 'POST', description: 'Simulate fake payment (UPI, Card, Net Banking, Wallet)' },
      { service: 'Payment Service', endpoint: '/api/payment/history', method: 'GET', description: 'Get transaction history' },
      { service: 'Notification Service', endpoint: '/api/notification/logs', method: 'GET', description: 'Get event notification logs' },
    ];

    return {
      timestamp: new Date().toISOString(),
      clusterStatus: healthChecks.every((h) => h.status === 'UP') ? 'HEALTHY' : 'DEGRADED',
      services: healthChecks,
      availableAPIs,
    };
  }
}

export const gatewayService = new GatewayService();
