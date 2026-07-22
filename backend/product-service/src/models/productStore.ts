import { IProduct, ProductQueryFilters } from '../types/index.js';

class ProductStore {
  private products: IProduct[] = [];

  constructor() {
    this.seedDefaultProducts();
  }

  private seedDefaultProducts() {
    this.products = [
      {
        id: 'prod_001',
        title: 'Apple MacBook Pro 16" M3 Max (36GB RAM, 1TB SSD)',
        description: 'Supercharged by M3 Max chip. Up to 22 hours of battery life. Liquid Retina XDR display.',
        price: 3499.00,
        originalPrice: 3899.00,
        discountPercentage: 10,
        rating: 4.9,
        reviewCount: 1420,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        stock: 45,
        isFeatured: true,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_002',
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        description: 'Industry leading noise canceling with two processors and 8 microphones. Auto NC Optimizer.',
        price: 398.00,
        originalPrice: 449.99,
        discountPercentage: 12,
        rating: 4.8,
        reviewCount: 5210,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        stock: 120,
        isFeatured: true,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_003',
        title: 'Samsung 65-Inch Class OLED S90C Series 4K TV',
        description: 'Neural Quantum Processor with 4K Upscaling, Quantum HDR OLED, Dolby Atmos sound.',
        price: 1597.99,
        originalPrice: 1999.00,
        discountPercentage: 20,
        rating: 4.7,
        reviewCount: 890,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
        stock: 18,
        isFeatured: true,
        isDeal: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_004',
        title: 'Nike Air Max 270 Men\'s Running Shoes',
        description: 'Large Max Air unit delivers responsive cushioning. Mesh upper for breathable comfort.',
        price: 150.00,
        originalPrice: 170.00,
        discountPercentage: 11,
        rating: 4.6,
        reviewCount: 3412,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        stock: 85,
        isFeatured: false,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_005',
        title: 'De\'Longhi Magnifica S Automatic Espresso Machine',
        description: 'Compact bean-to-cup machine with manual cappuccino system. Custom coffee strength controls.',
        price: 599.95,
        originalPrice: 699.00,
        discountPercentage: 14,
        rating: 4.7,
        reviewCount: 2150,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        stock: 30,
        isFeatured: true,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_006',
        title: 'Kindle Paperwhite (16 GB) 6.8" Display & Adjustable Warm Light',
        description: 'Now with a 6.8" display, thinner borders, adjustable warm light, up to 10 weeks battery life.',
        price: 149.99,
        originalPrice: 169.99,
        discountPercentage: 12,
        rating: 4.8,
        reviewCount: 18900,
        category: 'Books',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        stock: 200,
        isFeatured: true,
        isDeal: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_007',
        title: 'PlayStation 5 Console (Slim Digital Edition)',
        description: 'Harness the power of a custom CPU, GPU, and SSD with Integrated I/O. Ray tracing support.',
        price: 449.99,
        originalPrice: 499.99,
        discountPercentage: 10,
        rating: 4.9,
        reviewCount: 6540,
        category: 'Gaming',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
        stock: 25,
        isFeatured: true,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod_008',
        title: 'Anker Magnetic Wireless Power Bank 10,000mAh',
        description: 'MagSafe compatible portable charger with foldable stand for iPhone 15/14/13/12 series.',
        price: 49.99,
        originalPrice: 69.99,
        discountPercentage: 28,
        rating: 4.6,
        reviewCount: 4120,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
        stock: 150,
        isFeatured: false,
        isDeal: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  public getAll(filters?: ProductQueryFilters): IProduct[] {
    let result = [...this.products];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters?.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters?.isFeatured) {
      result = result.filter((p) => p.isFeatured);
    }

    if (filters?.isDeal) {
      result = result.filter((p) => p.isDeal);
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  public findById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getCategories(): string[] {
    const set = new Set(this.products.map((p) => p.category));
    return Array.from(set);
  }

  public add(product: IProduct): IProduct {
    this.products.push(product);
    return product;
  }

  public update(id: string, updates: Partial<Omit<IProduct, 'id'>>): IProduct | undefined {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.products[idx] = {
      ...this.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.products[idx];
  }

  public updateStock(id: string, quantityDeduction: number): IProduct | undefined {
    const product = this.findById(id);
    if (!product) return undefined;
    if (product.stock < quantityDeduction) {
      const err: any = new Error(`Insufficient stock for product ${product.title}. Available: ${product.stock}`);
      err.statusCode = 400;
      throw err;
    }
    product.stock -= quantityDeduction;
    product.updatedAt = new Date().toISOString();
    return product;
  }

  public delete(id: string): boolean {
    const len = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < len;
  }
}

export const productStore = new ProductStore();
