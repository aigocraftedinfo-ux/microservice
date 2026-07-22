import React, { useState } from 'react';
import { MapPin, Phone, User, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CheckoutPageProps {
  onProceedToPayment: (shippingAddress: any) => void;
  onNavigate: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onProceedToPayment, onNavigate }) => {
  const { cart } = useCart();
  const { user } = useAuth();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || 'John Doe',
    street: user?.address?.street || '123 Main Street',
    city: user?.address?.city || 'Seattle',
    state: user?.address?.state || 'WA',
    zipCode: user?.address?.zipCode || '98109',
    country: user?.address?.country || 'USA',
    phone: user?.phone || '+1-555-0142',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPayment(shippingAddress);
  };

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 bg-[#ffd814] text-gray-900 px-6 py-2 rounded-full text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
          <MapPin className="w-6 h-6 text-[#febd69]" />
          <h1 className="text-2xl font-bold text-gray-900">Checkout & Shipping Address</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Form */}
          <div className="md:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">1. Select Shipping Address</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleChange}
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleChange}
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ZIP / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    required
                    className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number for Delivery</label>
                <input
                  type="text"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleChange}
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded outline-none focus:border-[#febd69]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-4"
              >
                Use this Address & Proceed to Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Order Summary Side Card */}
          <div className="md:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
            <h2 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">2. Order Summary</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
              {cart?.items.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                    <span className="truncate text-gray-800">{item.product.title}</span>
                  </div>
                  <span className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span>${cart?.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping & Handling:</span>
                <span className="text-green-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Order Total:</span>
                <span>${cart?.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Order checkout will contact Order Service, Payment Service, and Notification Service upon confirmation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
