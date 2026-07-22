import { IPaymentTransaction } from '../types/index.js';

class PaymentStore {
  private transactions: IPaymentTransaction[] = [];

  public getAll(): IPaymentTransaction[] {
    return this.transactions;
  }

  public getByUserId(userId: string): IPaymentTransaction[] {
    return this.transactions.filter((t) => t.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getByTransactionId(txnId: string): IPaymentTransaction | undefined {
    return this.transactions.find((t) => t.transactionId === txnId);
  }

  public add(txn: IPaymentTransaction): IPaymentTransaction {
    this.transactions.push(txn);
    return txn;
  }
}

export const paymentStore = new PaymentStore();
