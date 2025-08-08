import React from 'react';
import { MapPin, Eye, Heart, Calendar } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice, formatRelativeTime, getCategoryLabel, getConditionLabel } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 hover:bg-opacity-100 transition-all">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
        </div>
        
        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${product.condition === 'new' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
            }
          `}>
            {getConditionLabel(product.condition)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {getCategoryLabel(product.category)}
          </span>
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye className="h-3 w-3" />
            <span className="text-xs">{product.views}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-xl font-bold text-red-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Location and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatRelativeTime(product.createdAt)}</span>
          </div>
        </div>

        {/* Vendor */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{product.vendor.name.charAt(0)}</span>
            </div>
            <span className="text-sm text-gray-600">{product.vendor.name}</span>
            {product.vendor.verified && (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;