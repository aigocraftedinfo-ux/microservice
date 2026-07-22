import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { orderStore } from '../models/orderStore.js';
import { config } from '../config/index.js';
import { IOrder, IShippingAddress } from '../types/index.js';

export class OrderService {
  public async createOrder(
    userId: string,
    userEmail: string,
    authToken: string,
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet',
    shippingAddress: IShippingAddress
  ) {
    const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

    // 1. Fetch user cart from Cart Service REST API
    let cartResponse;
    try {
      cartResponse = await axios.get(`${config.cartServiceUrl}/api/cart`, authHeaders);
    } catch (err: any) {
      const e: any = new Error(`Failed to contact Cart Service: ${err.message}`);
      e.statusCode = 502;
      throw e;
    }

    const cart = cartResponse.data.data;
    if (!cart || !cart.items || cart.items.length === 0) {
      const err: any = new Error('Cart is empty. Add items before checking out.');
      err.statusCode = 400;
      throw err;
    }

    const totalAmount = cart.totalAmount;
    const tempOrderId = `ord_${uuidv4().substring(0, 8)}`;

    // 2. Call Payment Service REST API to process fake payment
    let paymentResult;
    try {
      const paymentRes = await axios.post(
        `${config.paymentServiceUrl}/api/payment/process`,
        {
          orderId: tempOrderId,
          userId,
          amount: totalAmount,
          paymentMethod,
        },
        authHeaders
      );
      paymentResult = paymentRes.data.data;
    } catch (err: any) {
      const e: any = new Error(
        err.response?.data?.error || `Payment processing failed via Payment Service`
      );
      e.statusCode = err.response?.status || 400;
      throw e;
    }

    if (paymentResult.status !== 'SUCCESS') {
      const err: any = new Error('Payment was declined or failed.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Deduct stock in Product Service REST API for each line item
    for (const item of cart.items) {
      try {
        await axios.put(`${config.productServiceUrl}/api/product/inventory/${item.productId}`, {
          quantityDeduction: item.quantity,
        });
      } catch (err: any) {
        console.warn(`[Order-Service] Inventory update note for ${item.productId}: ${err.message}`);
      }
    }

    // 4. Create Order Object
    const newOrder: IOrder = {
      id: tempOrderId,
      userId,
      userEmail,
      items: cart.items,
      totalAmount,
      status: 'CONFIRMED',
      shippingAddress,
      paymentDetails: {
        paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orderStore.add(newOrder);

    // 5. Send Notification via Notification Service REST API
    try {
      await axios.post(`${config.notificationServiceUrl}/api/notification/send`, {
        userId,
        recipientEmail: userEmail,
        eventType: 'ORDER_CREATED',
        message: `Order #${newOrder.id} successfully placed! Amount: $${newOrder.totalAmount}. TXN ID: ${paymentResult.transactionId}`,
      });
    } catch (err: any) {
      console.warn(`[Order-Service] Notification dispatch notice: ${err.message}`);
    }

    // 6. Clear user cart via Cart Service REST API
    try {
      await axios.post(`${config.cartServiceUrl}/api/cart/clear`, {}, authHeaders);
    } catch (err: any) {
      console.warn(`[Order-Service] Cart clear note: ${err.message}`);
    }

    return newOrder;
  }

  public getMyOrders(userId: string) {
    return orderStore.getByUserId(userId);
  }

  public getAllOrders() {
    return orderStore.getAll();
  }

  public getOrderById(orderId: string, userId: string, role: string) {
    const order = orderStore.getById(orderId);
    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    if (role !== 'admin' && order.userId !== userId) {
      const err: any = new Error('Forbidden: You do not own this order');
      err.statusCode = 403;
      throw err;
    }
    return order;
  }

  public async cancelOrder(orderId: string, userId: string, role: string, userEmail: string) {
    const order = this.getOrderById(orderId, userId, role);
    if (order.status === 'CANCELLED') {
      const err: any = new Error('Order is already cancelled');
      err.statusCode = 400;
      throw err;
    }

    orderStore.updateStatus(orderId, 'CANCELLED');

    // Send cancellation notification via REST API
    try {
      await axios.post(`${config.notificationServiceUrl}/api/notification/send`, {
        userId: order.userId,
        recipientEmail: userEmail,
        eventType: 'ORDER_CANCELLED',
        message: `Order #${order.id} has been cancelled. Refund will be processed automatically.`,
      });
    } catch (err: any) {
      console.warn(`[Order-Service] Notification note: ${err.message}`);
    }

    return order;
  }

  public updateOrderStatus(orderId: string, status: IOrder['status']) {
    const updated = orderStore.updateStatus(orderId, status);
    if (!updated) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }
}

export const orderService = new OrderService();
