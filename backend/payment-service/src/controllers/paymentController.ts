import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { paymentService } from '../services/paymentService.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

const paymentProcessSchema = z.object({
  orderId: z.string().min(1, 'Order ID required'),
  userId: z.string().min(1, 'User ID required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['UPI', 'Card', 'Net Banking', 'Wallet']),
});

export class PaymentController {
  public async processPayment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = paymentProcessSchema.parse(req.body);
      const result = await paymentService.processPayment(validated);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const history = paymentService.getHistory(req.user.userId, req.user.role);
      res.status(200).json({ success: true, count: history.length, data: history });
    } catch (err) {
      next(err);
    }
  }

  public getByTransactionId(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const transaction = paymentService.getByTransactionId(req.params.txnId);
      res.status(200).json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  }
}

export const paymentController = new PaymentController();
