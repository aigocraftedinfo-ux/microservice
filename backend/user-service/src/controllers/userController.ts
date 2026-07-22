import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { userService } from '../services/userService.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'admin']).optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional(),
});

export class UserController {
  public async register(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await userService.register(validated);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await userService.login(validated);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  public async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const profile = userService.getProfile(req.user.userId);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  public async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const validated = updateProfileSchema.parse(req.body);
      const updated = userService.updateProfile(req.user.userId, validated);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  public async deleteProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }
      const result = userService.deleteProfile(req.user.userId);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      next(err);
    }
  }
}

export const userController = new UserController();
