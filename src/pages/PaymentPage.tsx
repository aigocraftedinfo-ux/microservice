import React, { useState } from 'react';
import { CreditCard, QrCode, Smartphone, Building2, Wallet, CheckCircle2, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { orderApi } from '../services/api';
import { useCart } from '../context/CartContext';

interface PaymentPageProps {
  shippingAddress: any;
  onNavigate: (page: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ shippingAddress, onNavigate }) => {
  const { cart, fetchCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Wallet'>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [processing, setProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePayNow = async () => {
    if (!shippingAddress) {
      setErrorMsg('Shipping address missing. Please go back and re-enter address.');
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');

      const res = await orderApi.checkout({
        paymentMethod,
        shippingAddress,
      });

      if (res.data.success) {
        setOrderResult(res.data.data);
        await fetchCart(); // Refresh cart to empty state
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Payment or Order processing failed via Microservices');
    } finally {
      setProcessing(false);
    }
  };

  if (orderResult) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-xl text-center space-y-5 animate-scale-up">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-gray-900">Payment Successful!</h2>
          <p className="text-xs text-gray-600">
            Your order has been confirmed by Order Service & Payment Service.
          </p>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-bold text-gray-900">{orderResult.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-bold text-emerald-600">{orderResult.paymentDetails.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-gray-900">${orderResult.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Method:</span>
              <span className="font-bold text-gray-900">{orderResult.paymentDetails.paymentMethod}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onNavigate('orders')}
              className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold py-2.5 rounded-full text-xs cursor-pointer"
            >
              Track Order History
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 rounded-full text-xs cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Simulation</h1>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-1 rounded">
            Google Pay / PhonePe / Paytm Style
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Payment Method Tabs & Controls */}
          <div className="md:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Choose Payment Method
            </h2>

            {/* Methods Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Debit / Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Net Banking')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'Net Banking'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Wallet')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'Wallet'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Wallet className="w-5 h-5 text-indigo-600" />
                <span>Wallet</span>
              </button>
            </div>

            {/* Dynamic Method Form */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <QrCode className="w-4 h-4 text-indigo-600" /> Enter Virtual Payment Address (VPA)
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@okaxis or example@paytm"
                    className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 font-mono"
                  />
                  <p className="text-[11px] text-gray-500">Supported: Google Pay, PhonePe, Paytm, BHIM UPI</p>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="08 / 28"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="***"
                        className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Bank</label>
                  <select className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none font-semibold">
                    <option>HDFC Bank</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'Wallet' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Wallet Provider</label>
                  <select className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded outline-none font-semibold">
                    <option>Amazon Pay Balance ($1,250 available)</option>
                    <option>Paytm Wallet</option>
                    <option>PhonePe Wallet</option>
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] disabled:bg-gray-300 text-gray-900 font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
                  Communicating with Payment Microservice...
                </>
              ) : (
                <>Pay Now (${cart?.totalAmount.toFixed(2)})</>
              )}
            </button>
          </div>

          {/* Right Summary */}
          <div className="md:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
            <h2 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Payable Amount</h2>

            <div className="text-3xl font-black text-gray-900">${cart?.totalAmount.toFixed(2)}</div>

            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-700 block">Deliver to:</span>
              <p className="text-gray-600">
                {shippingAddress?.name}, {shippingAddress?.street}, {shippingAddress?.city}, {shippingAddress?.state}{' '}
                {shippingAddress?.zipCode}, {shippingAddress?.country}
              </p>
              <p className="text-gray-500 font-mono">Phone: {shippingAddress?.phone}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs space-y-1">
              <div className="font-bold">256-Bit Encrypted Microservice Protocol</div>
              <p className="text-[11px] text-emerald-700">
                A unique <code className="font-bold">TXN-xxxxxxxx</code> token will be generated by the Payment Microservice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
