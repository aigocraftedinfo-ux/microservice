import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 text-center space-y-4 shadow-sm">
          <ShoppingCart className="w-12 h-12 text-[#febd69] mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-gray-600">Please sign in to view your items and continue shopping.</p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs py-2.5 rounded-full cursor-pointer"
          >
            Sign In to Your Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-12 text-center text-gray-500 font-medium">
        Loading cart from Cart Service REST API...
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Items List */}
        <div className="md:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#febd69]" /> Shopping Cart
            </h1>
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Cart
              </button>
            )}
          </div>

          {isEmpty ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-gray-500 text-sm">Your Amazon Shopping Cart has no items.</p>
              <button
                onClick={() => onNavigate('products')}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-6 py-2.5 rounded-full text-xs cursor-pointer"
              >
                Shop Today's Deals
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(item.productId)}
                    className="w-24 h-24 bg-gray-50 rounded-lg border border-gray-100 p-2 flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <h3
                      onClick={() => onSelectProduct(item.productId)}
                      className="font-bold text-sm text-gray-900 hover:text-[#c7511f] cursor-pointer line-clamp-2"
                    >
                      {item.product.title}
                    </h3>
                    <p className="text-xs text-green-700 font-medium">In Stock</p>
                    <p className="text-[11px] text-gray-500">Category: {item.product.category}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 pt-3">
                      <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                        <button
                          onClick={() => decreaseQuantity(item.productId)}
                          className="p-1.5 hover:bg-gray-200 rounded-l cursor-pointer text-gray-700"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.productId)}
                          className="p-1.5 hover:bg-gray-200 rounded-r cursor-pointer text-gray-700"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="text-right font-extrabold text-lg text-gray-900 sm:self-start">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Subtotal Box */}
        <div className="md:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider block font-bold mb-1">Order Summary</span>
            <div className="text-lg font-bold text-gray-900 flex justify-between items-baseline">
              <span>Subtotal ({cart?.totalItems || 0} items):</span>
              <span className="text-2xl font-black text-gray-900">${cart?.totalAmount.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <ShieldCheck className="w-4 h-4" /> FREE Shipping on this order
            </div>
            <p>100% Secure Checkout powered by Microservices Payment Gateway.</p>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            disabled={isEmpty}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] disabled:bg-gray-200 text-gray-900 font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
