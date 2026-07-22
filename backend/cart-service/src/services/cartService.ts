import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { cartStore } from '../models/cartStore.js';
import { config } from '../config/index.js';
import { ICartItem } from '../types/index.js';

export class CartService {
  public getCart(userId: string) {
    return cartStore.getCart(userId);
  }

  public async addToCart(userId: string, productId: string, quantity: number = 1) {
    // REST API call to Product Service
    let productData;
    try {
      const response = await axios.get(`${config.productServiceUrl}/api/product/products/${productId}`);
      productData = response.data.data;
    } catch (error: any) {
      const err: any = new Error(
        error.response?.data?.error || `Failed to fetch product details from Product Service (${config.productServiceUrl})`
      );
      err.statusCode = error.response?.status || 404;
      throw err;
    }

    const cart = cartStore.getCart(userId);
    const existingIndex = cart.items.findIndex((item) => item.productId === productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      const newItem: ICartItem = {
        id: `ci_${uuidv4().substring(0, 8)}`,
        productId: productData.id,
        product: {
          id: productData.id,
          title: productData.title,
          price: productData.price,
          imageUrl: productData.imageUrl,
          category: productData.category,
          stock: productData.stock,
        },
        quantity,
      };
      cart.items.push(newItem);
    }

    return cartStore.saveCart(cart);
  }

  public updateQuantity(userId: string, productId: string, change: number) {
    const cart = cartStore.getCart(userId);
    const index = cart.items.findIndex((item) => item.productId === productId);

    if (index === -1) {
      const err: any = new Error('Product not found in cart');
      err.statusCode = 404;
      throw err;
    }

    cart.items[index].quantity += change;

    if (cart.items[index].quantity <= 0) {
      cart.items.splice(index, 1);
    }

    return cartStore.saveCart(cart);
  }

  public removeItem(userId: string, productId: string) {
    const cart = cartStore.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    return cartStore.saveCart(cart);
  }

  public clearCart(userId: string) {
    return cartStore.clearCart(userId);
  }
}

export const cartService = new CartService();
