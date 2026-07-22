import { v4 as uuidv4 } from 'uuid';
import { notificationStore } from '../models/notificationStore.js';
import { INotificationLog } from '../types/index.js';

export class NotificationService {
  public sendNotification(data: {
    userId?: string;
    recipientEmail?: string;
    eventType: 'ORDER_CREATED' | 'PAYMENT_SUCCESS' | 'ORDER_CANCELLED' | 'EMAIL_SENT';
    message: string;
  }) {
    const log: INotificationLog = {
      id: `notif_${uuidv4().substring(0, 8)}`,
      userId: data.userId,
      recipientEmail: data.recipientEmail,
      eventType: data.eventType,
      message: data.message,
      timestamp: new Date().toISOString(),
    };

    return notificationStore.add(log);
  }

  public getLogs(userId?: string) {
    if (userId) {
      return notificationStore.getByUserId(userId);
    }
    return notificationStore.getAll();
  }
}

export const notificationService = new NotificationService();
