import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';
import { Cart } from '../types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCart();
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      alert('Please log in to add items to your cart.');
      return;
    }
    const res = await cartApi.addToCart(productId, quantity);
    if (res.data.success) {
      setCart(res.data.data);
    }
  };

  const increaseQuantity = async (productId: string) => {
    const res = await cartApi.increaseQuantity(productId);
    if (res.data.success) {
      setCart(res.data.data);
    }
  };

  const decreaseQuantity = async (productId: string) => {
    const res = await cartApi.decreaseQuantity(productId);
    if (res.data.success) {
      setCart(res.data.data);
    }
  };

  const removeItem = async (productId: string) => {
    const res = await cartApi.removeItem(productId);
    if (res.data.success) {
      setCart(res.data.data);
    }
  };

  const clearCart = async () => {
    const res = await cartApi.clearCart();
    if (res.data.success) {
      setCart(res.data.data);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
