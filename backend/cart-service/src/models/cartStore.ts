import { ICart, ICartItem } from '../types/index.js';

class CartStore {
  private carts: Map<string, ICart> = new Map();

  public getCart(userId: string): ICart {
    if (!this.carts.has(userId)) {
      const emptyCart: ICart = {
        userId,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        updatedAt: new Date().toISOString(),
      };
      this.carts.set(userId, emptyCart);
    }
    return this.recalculate(this.carts.get(userId)!);
  }

  public saveCart(cart: ICart): ICart {
    const updated = this.recalculate(cart);
    this.carts.set(cart.userId, updated);
    return updated;
  }

  public clearCart(userId: string): ICart {
    const emptyCart: ICart = {
      userId,
      items: [],
      totalAmount: 0,
      totalItems: 0,
      updatedAt: new Date().toISOString(),
    };
    this.carts.set(userId, emptyCart);
    return emptyCart;
  }

  private recalculate(cart: ICart): ICart {
    let totalAmount = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      totalAmount += item.product.price * item.quantity;
      totalItems += item.quantity;
    }

    cart.totalAmount = Math.round(totalAmount * 100) / 100;
    cart.totalItems = totalItems;
    cart.updatedAt = new Date().toISOString();
    return cart;
  }
}

export const cartStore = new CartStore();
