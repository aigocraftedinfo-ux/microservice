import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div
      onClick={() => onViewDetails(product.id)}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden p-4 flex items-center justify-center">
        {product.isDeal && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            LIMITED TIME DEAL
          </span>
        )}
        <img
          src={product.imageUrl}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-[#c7511f] transition-colors mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-700 ml-1">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
            {product.discountPercentage && (
              <span className="text-xs font-bold text-green-700">({product.discountPercentage}% off)</span>
            )}
          </div>

          <div className="text-[11px] text-gray-500 mt-0.5">
            {product.stock > 0 ? (
              <span className="text-green-700 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] disabled:bg-gray-200 text-gray-900 text-xs font-semibold py-2 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product.id);
            }}
            className="p-2 border border-gray-300 hover:bg-gray-50 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
