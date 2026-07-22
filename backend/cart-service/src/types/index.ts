export interface ICartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
    stock: number;
  };
  quantity: number;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;
}
