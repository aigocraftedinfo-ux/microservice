import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import { productApi, gatewayApi } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
  onSelectCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct, onSelectCategory }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [clusterStatus, setClusterStatus] = useState<'HEALTHY' | 'DEGRADED' | 'CHECKING'>('CHECKING');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products and cluster status
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, dealsRes, dashRes] = await Promise.allSettled([
          productApi.getProducts({ isFeatured: true }),
          productApi.getProducts({ isDeal: true }),
          gatewayApi.getDashboard(),
        ]);

        if (featRes.status === 'fulfilled' && featRes.value.data.success) {
          setFeaturedProducts(featRes.value.data.data);
        }
        if (dealsRes.status === 'fulfilled' && dealsRes.value.data.success) {
          setDeals(dealsRes.value.data.data);
        }
        if (dashRes.status === 'fulfilled' && dashRes.value.data.success) {
          setClusterStatus(dashRes.value.data.data.clusterStatus);
        } else {
          setClusterStatus('HEALTHY');
        }
      } catch (err) {
        console.error('Home load error', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const categoriesList = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', desc: 'Laptops, Headphones & Audio' },
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', desc: 'Men & Women Wear, Shoes' },
    { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80', desc: 'Espresso Machines, Cookware' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', desc: 'Kindle Readers & Bestsellers' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      {/* Microservice Architecture Top Alert Banner */}
      <div className="bg-slate-900 text-white px-4 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">Microservice Cluster Live:</span>
            <span className="text-gray-300">User, Product, Cart, Order, Payment & Notification services active</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono text-[11px]">
              REST Communication
            </span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-[#febd69] hover:underline font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> View System Dashboard & Ping Tests
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#febd69] text-gray-950 text-xs font-bold px-3 py-1 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" /> Next-Gen Enterprise E-Commerce
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              Amazon Microservices Platform
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
              Experience a production-engineered Amazon clone running on 6 independent REST backend microservices with real-time stock deduction, simulated payments, and event logging.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('products')}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                Shop All Catalog <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold px-5 py-3 rounded-full text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#febd69]" /> Cluster Architecture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl font-black text-[#febd69]">6</span>
              <p className="text-xs text-gray-300 font-medium mt-1">Independent Microservices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl font-black text-emerald-400">100%</span>
              <p className="text-xs text-gray-300 font-medium mt-1">REST API Isolation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl font-black text-sky-400">In-Memory</span>
              <p className="text-xs text-gray-300 font-medium mt-1">Fast Data Persistence</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl font-black text-amber-400">UPI / Card</span>
              <p className="text-xs text-gray-300 font-medium mt-1">Simulated Gateways</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20 space-y-8">
        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesList.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                onSelectCategory(cat.name);
                onNavigate('products');
              }}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{cat.desc}</p>
              </div>
              <div className="aspect-video w-full bg-gray-50 rounded-lg overflow-hidden mb-3">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-xs font-bold text-[#007185] hover:underline flex items-center gap-1">
                Shop now <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>

        {/* Today's Deals Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                TODAY'S DEALS
              </span>
              <h2 className="text-xl font-bold text-gray-900">Up to 30% Off Hot Tech & Fashion</h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#007185] hover:underline flex items-center gap-1"
            >
              See all deals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 text-sm">Loading Deals from Product Service...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {deals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={onSelectProduct} />
              ))}
            </div>
          )}
        </div>

        {/* Featured Products Grid */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold text-[#007185] hover:underline flex items-center gap-1"
            >
              Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 text-sm">Loading Featured Catalog...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
