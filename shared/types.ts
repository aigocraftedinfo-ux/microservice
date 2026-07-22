export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Product {
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
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentDetails {
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  transactionId: string;
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}

export interface NotificationLog {
  id: string;
  userId?: string;
  recipientEmail?: string;
  eventType: 'ORDER_CREATED' | 'PAYMENT_SUCCESS' | 'ORDER_CANCELLED' | 'EMAIL_SENT';
  message: string;
  timestamp: string;
}

export interface ServiceHealth {
  service: string;
  status: 'UP' | 'DOWN';
  port: number;
  responseTimeMs: number;
  lastChecked: string;
  url: string;
}
