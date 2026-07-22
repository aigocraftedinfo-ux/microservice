import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productService } from '../services/productService.js';

const productCreateSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().min(5, 'Description required'),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  category: z.string().min(2, 'Category required'),
  imageUrl: z.string().url('Valid image URL required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  isFeatured: z.boolean().optional(),
  isDeal: z.boolean().optional(),
});

export class ProductController {
  public getAllProducts(req: Request, res: Response, next: NextFunction): void {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        isFeatured: req.query.isFeatured === 'true',
        isDeal: req.query.isDeal === 'true',
        sortBy: req.query.sortBy as any,
      };

      const products = productService.getAllProducts(filters);
      res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
      next(err);
    }
  }

  public getProductById(req: Request, res: Response, next: NextFunction): void {
    try {
      const product = productService.getProductById(req.params.id);
      res.status(200).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  public getCategories(req: Request, res: Response, next: NextFunction): void {
    try {
      const categories = productService.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  }

  public addProduct(req: Request, res: Response, next: NextFunction): void {
    try {
      const validated = productCreateSchema.parse(req.body);
      const product = productService.addProduct(validated);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  public updateProduct(req: Request, res: Response, next: NextFunction): void {
    try {
      const updated = productService.updateProduct(req.params.id, req.body);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  public updateInventory(req: Request, res: Response, next: NextFunction): void {
    try {
      const { quantityDeduction } = req.body;
      if (typeof quantityDeduction !== 'number' || quantityDeduction <= 0) {
        res.status(400).json({ success: false, error: 'quantityDeduction must be a positive number' });
        return;
      }
      const updated = productService.updateInventory(req.params.id, quantityDeduction);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  public deleteProduct(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = productService.deleteProduct(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const productController = new ProductController();
