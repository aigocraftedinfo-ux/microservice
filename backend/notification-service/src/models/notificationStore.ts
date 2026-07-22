import { INotificationLog } from '../types/index.js';

class NotificationStore {
  private logs: INotificationLog[] = [];

  public getAll(): INotificationLog[] {
    return this.logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getByUserId(userId: string): INotificationLog[] {
    return this.logs.filter((l) => l.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public add(log: INotificationLog): INotificationLog {
    this.logs.push(log);
    console.log(`[Notification-Service Log] [${log.eventType}] ${log.message}`);
    return log;
  }
}

export const notificationStore = new NotificationStore();
