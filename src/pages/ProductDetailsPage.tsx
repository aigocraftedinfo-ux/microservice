import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { productApi } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((res) => {
        if (res.data.success) {
          setProduct(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-12 text-center text-gray-500 font-medium">
        Loading details from Product Service REST API...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-12 text-center">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <button
          onClick={() => onNavigate('products')}
          className="mt-4 bg-[#ffd814] text-gray-900 px-4 py-2 rounded-full text-xs font-bold"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#007185] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search Results
        </button>

        {/* Added to Cart Toast Notice */}
        {addedNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">Added {quantity} item(s) to Cart!</span>
            </div>
            <button
              onClick={() => onNavigate('cart')}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-4 py-1.5 rounded-full text-xs"
            >
              Go to Cart
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-sm">
          {/* Product Image Column */}
          <div className="md:col-span-5 flex items-center justify-center bg-gray-50 p-6 rounded-xl border border-gray-100 max-h-[480px]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Product Info Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{product.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.title}</h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">{product.rating} out of 5</span>
              <span className="text-xs text-[#007185] hover:underline cursor-pointer">
                {product.reviewCount.toLocaleString()} ratings
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes & FREE Express Prime Shipping</p>
            </div>

            {/* Features list */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="font-bold text-sm text-gray-900">About this item</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-gray-700 mx-auto mb-1" />
                <span className="text-[11px] text-gray-600 block font-medium">Free Delivery</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-700 mx-auto mb-1" />
                <span className="text-[11px] text-gray-600 block font-medium">30 Days Return</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-gray-700 mx-auto mb-1" />
                <span className="text-[11px] text-gray-600 block font-medium">1 Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Buy Box Box */}
          <div className="md:col-span-3 bg-gray-50 p-5 rounded-xl border border-gray-200 h-fit space-y-4">
            <div className="text-2xl font-bold text-gray-900">${(product.price * quantity).toFixed(2)}</div>

            <div className="text-xs">
              {product.stock > 0 ? (
                <span className="text-green-700 font-bold">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600 font-bold">Currently Unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-gray-300 rounded-md p-2 text-xs font-semibold outline-none cursor-pointer"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] disabled:bg-gray-200 text-gray-900 font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={async () => {
                  await handleAddToCart();
                  onNavigate('checkout');
                }}
                disabled={product.stock <= 0}
                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e27700] disabled:bg-gray-200 text-gray-900 font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                Buy Now
              </button>
            </div>

            <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-200 space-y-1">
              <div>Ships from: <span className="font-semibold text-gray-800">Amazon Clone Warehouse</span></div>
              <div>Sold by: <span className="font-semibold text-gray-800">Amazon Retail Service</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
