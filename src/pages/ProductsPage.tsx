import React, { useEffect, useState } from 'react';
import { Filter, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { productApi } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  initialSearchQuery?: string;
  initialCategory?: string;
  onSelectProduct: (id: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  initialSearchQuery = '',
  initialCategory = '',
  onSelectProduct,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialSearchQuery);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  useEffect(() => {
    productApi
      .getCategories()
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        search: search || undefined,
        category: category || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy: sortBy || undefined,
      };

      const res = await productApi.getProducts(params);
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category, sortBy]);

  const handleApplyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('rating');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#febd69]" /> Filters
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, keyword..."
                className="w-full text-xs p-2.5 pl-8 border border-gray-300 rounded-md outline-none focus:border-[#febd69]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Category</label>
            <div className="space-y-1.5">
              <button
                onClick={() => setCategory('')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors ${
                  category === '' ? 'bg-[#febd69]/20 font-bold text-black' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition-colors ${
                    category === cat ? 'bg-[#febd69]/20 font-bold text-black' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <form onSubmit={handleApplyPriceFilter} className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Price ($)</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#febd69]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded outline-none focus:border-[#febd69]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 rounded transition-colors cursor-pointer"
            >
              Apply Price
            </button>
          </form>
        </div>

        {/* Right Main Product Grid Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Top Bar / Results Count & Sorting */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm font-semibold text-gray-700">
              Showing <span className="font-bold text-gray-900">{products.length}</span> results
              {category && <span className="text-gray-500 font-normal"> in "{category}"</span>}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-md text-xs py-1.5 px-3 font-medium outline-none cursor-pointer"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="bg-white p-12 rounded-xl text-center text-gray-500 font-medium">
              Fetching products from Product Service REST API...
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center space-y-3 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">No products match your criteria</h3>
              <p className="text-xs text-gray-500">Try adjusting your search terms or filter parameters.</p>
              <button
                onClick={handleResetFilters}
                className="bg-[#ffd814] text-gray-900 text-xs font-bold px-4 py-2 rounded-full cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={onSelectProduct} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
