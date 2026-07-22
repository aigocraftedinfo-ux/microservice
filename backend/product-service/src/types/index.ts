export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  category: string;
  imageUrl: string;
  stock: number;
  isFeatured?: boolean;
  isDeal?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isDeal?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
