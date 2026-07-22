export interface INotificationLog {
  id: string;
  userId?: string;
  recipientEmail?: string;
  eventType: 'ORDER_CREATED' | 'PAYMENT_SUCCESS' | 'ORDER_CANCELLED' | 'EMAIL_SENT';
  message: string;
  timestamp: string;
}
