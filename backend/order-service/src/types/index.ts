export interface IShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IPaymentDetails {
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  transactionId: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

export interface IOrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category: string;
  };
  quantity: number;
}

export interface IOrder {
  id: string;
  userId: string;
  userEmail?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: IShippingAddress;
  paymentDetails: IPaymentDetails;
  createdAt: string;
  updatedAt: string;
}
