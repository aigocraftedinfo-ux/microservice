import React, { useEffect, useState } from 'react';
import { Package, Calendar, MapPin, CreditCard, XCircle, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { orderApi } from '../services/api';
import { Order } from '../types';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getMyOrders();
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res.data.success) {
        setActionMsg(`Order #${orderId} was cancelled successfully.`);
        loadOrders();
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Order Confirmed
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 border border-gray-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#febd69]" />
            <h1 className="text-2xl font-bold text-gray-900">Your Orders & History</h1>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-[#007185] hover:underline cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>

        {actionMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold">
            {actionMsg}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-12 rounded-xl text-center text-gray-500 font-medium">
            Fetching order history from Order Service REST API...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center border border-gray-200 space-y-3">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-gray-800">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500">Looks like you haven't bought anything yet.</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-[#ffd814] text-gray-900 font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header Bar */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-gray-500 block uppercase font-bold text-[10px]">ORDER PLACED</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500 block uppercase font-bold text-[10px]">TOTAL AMOUNT</span>
                      <span className="font-extrabold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block uppercase font-bold text-[10px]">SHIP TO</span>
                      <span className="font-semibold text-gray-800">{order.shippingAddress.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-[11px]">ORDER #{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items & Shipping Details Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Items */}
                  <div className="md:col-span-8 space-y-4 divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="pt-3 flex items-center gap-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-16 h-16 object-contain bg-gray-50 p-1.5 rounded border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-bold text-gray-900 truncate">{item.product.title}</h4>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-bold text-gray-800 mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment & Action */}
                  <div className="md:col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-xs flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-gray-900 block mb-1">Transaction Information</span>
                      <p className="text-gray-600">
                        Method: <span className="font-semibold">{order.paymentDetails.paymentMethod}</span>
                      </p>
                      <p className="text-emerald-700 font-mono font-bold mt-1 text-[11px]">
                        TXN ID: {order.paymentDetails.transactionId}
                      </p>
                    </div>

                    {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full border border-red-300 hover:bg-red-50 text-red-700 font-bold py-2 rounded-lg cursor-pointer transition-colors text-xs flex items-center justify-center gap-1 mt-2"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
