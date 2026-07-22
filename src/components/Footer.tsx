import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#131921] text-white mt-12 text-sm select-none">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-center py-3 text-xs font-semibold tracking-wide cursor-pointer transition-colors"
      >
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 text-xs">
        <div>
          <h3 className="font-bold text-sm text-white mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>About Amazon Clone</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Microservices Architecture</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>System Health & Status</li>
            <li className="hover:underline cursor-pointer">Press Center</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Backend Microservices</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>User Service (Auth & JWT)</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Product Service (Catalog & Stock)</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Cart Service (Shopping Session)</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Order Service (Fulfillment)</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Payment Service (Fake Gateway)</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>Notification Service (Event Logs)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Payment & Options</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Amazon Pay / UPI</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Credit & Debit Cards</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Net Banking</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Wallet Payments</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('profile')}>Your Account</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('orders')}>Your Orders</li>
            <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
            <li className="hover:underline cursor-pointer" onClick={() => onNavigate('admin')}>API Swagger Documentation</li>
          </ul>
        </div>
      </div>

      {/* Copyright & Info */}
      <div className="py-6 text-center text-xs text-gray-400 space-y-2">
        <div className="flex items-center justify-center gap-4">
          <span className="font-bold text-white">Amazon Clone Microservices</span>
          <span>•</span>
          <span>REST API Communication</span>
          <span>•</span>
          <span>In-Memory Persistence</span>
        </div>
        <p>© 2026 Amazon Clone, Inc. Built for Enterprise Microservices Demonstration.</p>
      </div>
    </footer>
  );
};
