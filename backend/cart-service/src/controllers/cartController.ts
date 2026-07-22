import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { cartService } from '../services/cartService.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive().optional().default(1),
});

const quantitySchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

export class CartController {
  public getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const cart = cartService.getCart(req.user.userId);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  public async addToCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const validated = addToCartSchema.parse(req.body);
      const cart = await cartService.addToCart(req.user.userId, validated.productId, validated.quantity);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  public increaseQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const validated = quantitySchema.parse(req.body);
      const cart = cartService.updateQuantity(req.user.userId, validated.productId, 1);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  public decreaseQuantity(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const validated = quantitySchema.parse(req.body);
      const cart = cartService.updateQuantity(req.user.userId, validated.productId, -1);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  public removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const cart = cartService.removeItem(req.user.userId, req.params.productId);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }

  public clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const cart = cartService.clearCart(req.user.userId);
      res.status(200).json({ success: true, data: cart });
    } catch (err) {
      next(err);
    }
  }
}

export const cartController = new CartController();
