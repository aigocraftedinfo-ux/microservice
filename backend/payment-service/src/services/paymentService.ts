import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { paymentStore } from '../models/paymentStore.js';
import { config } from '../config/index.js';
import { IPaymentTransaction } from '../types/index.js';

export class PaymentService {
  public async processPayment(data: {
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  }) {
    const txnId = `TXN-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Fake payment simulation (always succeeds unless explicitly tested with negative amount)
    const isSuccess = data.amount > 0;
    const status = isSuccess ? 'SUCCESS' : 'FAILED';

    const transaction: IPaymentTransaction = {
      id: `pay_${uuidv4().substring(0, 8)}`,
      transactionId: txnId,
      orderId: data.orderId,
      userId: data.userId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status,
      timestamp: new Date().toISOString(),
    };

    paymentStore.add(transaction);

    // Call Notification Service via REST API
    try {
      await axios.post(`${config.notificationServiceUrl}/api/notification/send`, {
        userId: data.userId,
        eventType: 'PAYMENT_SUCCESS',
        message: `Payment of $${data.amount} via ${data.paymentMethod} processed successfully. Transaction ID: ${txnId}`,
      });
    } catch (err: any) {
      console.warn(`[Payment-Service] Notification dispatch note: ${err.message}`);
    }

    return transaction;
  }

  public getHistory(userId: string, role: string) {
    if (role === 'admin') {
      return paymentStore.getAll();
    }
    return paymentStore.getByUserId(userId);
  }

  public getByTransactionId(txnId: string) {
    const txn = paymentStore.getByTransactionId(txnId);
    if (!txn) {
      const err: any = new Error('Transaction not found');
      err.statusCode = 404;
      throw err;
    }
    return txn;
  }
}

export const paymentService = new PaymentService();
