import { v4 as uuidv4 } from 'uuid';
import { productStore } from '../models/productStore.js';
import { IProduct, ProductQueryFilters } from '../types/index.js';

export class ProductService {
  public getAllProducts(filters?: ProductQueryFilters) {
    return productStore.getAll(filters);
  }

  public getProductById(id: string) {
    const product = productStore.findById(id);
    if (!product) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return product;
  }

  public getCategories() {
    return productStore.getCategories();
  }

  public addProduct(data: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) {
    const newProduct: IProduct = {
      ...data,
      id: `prod_${uuidv4().substring(0, 8)}`,
      rating: 4.5,
      reviewCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return productStore.add(newProduct);
  }

  public updateProduct(id: string, updates: Partial<IProduct>) {
    const updated = productStore.update(id, updates);
    if (!updated) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  public updateInventory(id: string, quantityDeduction: number) {
    return productStore.updateStock(id, quantityDeduction);
  }

  public deleteProduct(id: string) {
    const deleted = productStore.delete(id);
    if (!deleted) {
      const err: any = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return { message: 'Product deleted successfully' };
  }
}

export const productService = new ProductService();
