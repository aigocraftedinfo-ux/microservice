import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { notificationService } from '../services/notificationService.js';

const notificationSchema = z.object({
  userId: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  eventType: z.enum(['ORDER_CREATED', 'PAYMENT_SUCCESS', 'ORDER_CANCELLED', 'EMAIL_SENT']),
  message: z.string().min(1, 'Message is required'),
});

export class NotificationController {
  public sendNotification(req: Request, res: Response, next: NextFunction): void {
    try {
      const validated = notificationSchema.parse(req.body);
      const log = notificationService.sendNotification(validated);
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }

  public getLogs(req: Request, res: Response, next: NextFunction): void {
    try {
      const userId = req.query.userId as string | undefined;
      const logs = notificationService.getLogs(userId);
      res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
