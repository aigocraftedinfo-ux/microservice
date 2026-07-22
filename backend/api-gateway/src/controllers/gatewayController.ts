import { Request, Response, NextFunction } from 'express';
import { gatewayService } from '../services/gatewayService.js';
import { config } from '../config/index.js';

export class GatewayController {
  public async getHealth(req: Request, res: Response): Promise<void> {
    const metrics = await gatewayService.getDashboardMetrics();
    const isUp = metrics.clusterStatus === 'HEALTHY';
    res.status(isUp ? 200 : 503).json({
      status: isUp ? 'UP' : 'DEGRADED',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      cluster: metrics.services,
    });
  }

  public async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await gatewayService.getDashboardMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (err) {
      next(err);
    }
  }

  public async pingSingleService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serviceName = req.params.serviceName as keyof typeof config.services;
      const serviceUrl = config.services[serviceName];

      if (!serviceUrl) {
        res.status(404).json({ success: false, error: `Service ${serviceName} not found in cluster configuration` });
        return;
      }

      const report = await gatewayService.pingService(serviceName, serviceUrl);
      res.status(200).json({ success: true, data: report });
    } catch (err) {
      next(err);
    }
  }
}

export const gatewayController = new GatewayController();
