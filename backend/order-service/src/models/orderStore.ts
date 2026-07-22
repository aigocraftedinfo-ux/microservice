import { IOrder } from '../types/index.js';

class OrderStore {
  private orders: IOrder[] = [];

  public getAll(): IOrder[] {
    return this.orders;
  }

  public getByUserId(userId: string): IOrder[] {
    return this.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getById(orderId: string): IOrder | undefined {
    return this.orders.find((o) => o.id === orderId);
  }

  public add(order: IOrder): IOrder {
    this.orders.push(order);
    return order;
  }

  public updateStatus(orderId: string, status: IOrder['status']): IOrder | undefined {
    const order = this.getById(orderId);
    if (!order) return undefined;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}

export const orderStore = new OrderStore();
