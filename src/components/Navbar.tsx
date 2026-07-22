import React, { useState } from 'react';
import { Search, ShoppingCart, User, MapPin, ChevronDown, Package, ShieldCheck, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onSearch?: (query: string, category: string) => void;
  onSelectCategory?: (category: string) => void;
  onNavigate: (page: string) => void;
  activePage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onSelectCategory, onNavigate, activePage }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Gaming'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory === 'All' ? '' : selectedCategory);
    }
    onNavigate('products');
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat === 'All' ? '' : cat);
    }
    onNavigate('products');
  };

  return (
    <header className="sticky top-0 z-50 text-white select-none">
      {/* Top Navbar */}
      <div className="bg-[#131921] px-4 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 cursor-pointer p-1 hover:outline hover:outline-1 hover:outline-white rounded"
        >
          <span className="text-2xl font-black tracking-tight text-white flex items-center">
            amazon<span className="text-[#febd69] font-bold text-lg">.clone</span>
          </span>
          <span className="bg-[#febd69] text-xs font-semibold text-black px-1.5 py-0.5 rounded ml-1">
            MICROSERVICES
          </span>
        </div>

        {/* Deliver To Location */}
        <div className="hidden md:flex items-center gap-1 cursor-pointer p-1.5 hover:outline hover:outline-1 hover:outline-white rounded text-xs">
          <MapPin className="w-4 h-4 text-[#febd69]" />
          <div>
            <div className="text-gray-300 text-[11px]">Deliver to</div>
            <div className="font-bold text-white leading-none">
              {user?.address?.city ? `${user.address.city}, ${user.address.state}` : 'Seattle 98109'}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#febd69]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs py-2 px-2 border-r border-gray-300 cursor-pointer outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon Microservices..."
            className="w-full py-2 px-3 text-black bg-white text-sm outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-4 py-2 flex items-center justify-center cursor-pointer transition-colors"
          >
            <Search className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Admin Dashboard Quick Access */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-xs font-semibold ${
                activePage === 'admin' ? 'bg-[#febd69] text-black' : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>
          )}

          {/* User Account / Login */}
          <div className="relative group p-1.5 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer">
            {isAuthenticated ? (
              <div onClick={() => onNavigate('profile')} className="text-xs">
                <div className="text-gray-300 text-[11px]">Hello, {user?.name.split(' ')[0]}</div>
                <div className="font-bold flex items-center gap-1">
                  Account & Profile <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            ) : (
              <div onClick={() => onNavigate('login')} className="text-xs">
                <div className="text-gray-300 text-[11px]">Hello, sign in</div>
                <div className="font-bold flex items-center gap-1">
                  Account & Lists <ChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Orders */}
          <div
            onClick={() => (isAuthenticated ? onNavigate('orders') : onNavigate('login'))}
            className="hidden sm:block p-1.5 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer text-xs"
          >
            <div className="text-gray-300 text-[11px]">Returns</div>
            <div className="font-bold">& Orders</div>
          </div>

          {/* Cart Icon */}
          <div
            onClick={() => onNavigate('cart')}
            className="flex items-center p-1.5 hover:outline hover:outline-1 hover:outline-white rounded cursor-pointer relative"
          >
            <div className="relative">
              <ShoppingCart className="w-8 h-8 text-white" />
              <span className="absolute -top-1.5 right-1.5 bg-[#febd69] text-black font-extrabold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart?.totalItems || 0}
              </span>
            </div>
            <span className="font-bold text-sm hidden md:inline ml-1 self-end">Cart</span>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar */}
      <div className="bg-[#232f3e] px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap border-t border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white p-1 rounded font-bold"
          >
            <Menu className="w-4 h-4" /> All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="hover:outline hover:outline-1 hover:outline-white p-1 rounded text-gray-200 hover:text-white"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('admin')}
            className="text-[#febd69] hover:underline font-semibold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Service Health & Cluster Monitor
          </button>
          {isAuthenticated && (
            <button onClick={logout} className="text-gray-300 hover:text-white flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
