export interface IPaymentTransaction {
  id: string;
  transactionId: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  status: 'SUCCESS' | 'FAILED';
  timestamp: string;
}
