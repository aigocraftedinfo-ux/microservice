import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { orderService } from '../services/orderService.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

const checkoutSchema = z.object({
  paymentMethod: z.enum(['UPI', 'Card', 'Net Banking', 'Wallet']),
  shippingAddress: z.object({
    name: z.string().min(1, 'Name required'),
    street: z.string().min(1, 'Street required'),
    city: z.string().min(1, 'City required'),
    state: z.string().min(1, 'State required'),
    zipCode: z.string().min(1, 'ZIP required'),
    country: z.string().min(1, 'Country required'),
    phone: z.string().min(1, 'Phone required'),
  }),
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export class OrderController {
  public async checkout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.token) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const validated = checkoutSchema.parse(req.body);
      const order = await orderService.createOrder(
        req.user.userId,
        req.user.email,
        req.token,
        validated.paymentMethod,
        validated.shippingAddress
      );
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  public getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const orders = orderService.getMyOrders(req.user.userId);
      res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  }

  public getAllOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const orders = orderService.getAllOrders();
      res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
      next(err);
    }
  }

  public getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const order = orderService.getOrderById(req.params.id, req.user.userId, req.user.role);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  public async cancelOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const order = await orderService.cancelOrder(req.params.id, req.user.userId, req.user.role, req.user.email);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  public updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const validated = statusSchema.parse(req.body);
      const order = orderService.updateOrderStatus(req.params.id, validated.status);
      res.status(200).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
