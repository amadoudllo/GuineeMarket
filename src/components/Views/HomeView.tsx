import React, { useState, useMemo } from 'react';
import { Filter, Search } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product, ProductCategory } from '../../types';
import ProductGrid from '../Product/ProductGrid';
import FilterPanel from '../Filters/FilterPanel';

interface HomeViewProps {
  onProductClick: (product: Product) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onProductClick }) => {
  const { products: allProducts, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '' as ProductCategory | '',
    condition: '' as 'new' | 'used' | '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  // Filter approved products only
  const approvedProducts = allProducts.filter(product => product.status === 'approved');

  const filteredProducts = useMemo(() => {
    return approvedProducts.filter(product => {
      // Search filter
      if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Condition filter
      if (filters.condition && product.condition !== filters.condition) {
        return false;
      }

      // Price filters
      if (filters.minPrice && product.price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Location filter
      if (filters.location && product.location !== filters.location) {
        return false;
      }

      return true;
    });
  }, [approvedProducts, searchTerm, filters]);

  const featuredProducts = filteredProducts.filter(product => product.featured);

  if (loading) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 p-4 lg:p-6">
        {/* Search and Filters Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span>Filtres</span>
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Produits en vedette</h2>
            <ProductGrid products={featuredProducts} onProductClick={onProductClick} />
          </div>
        )}

        {/* All Products */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {featuredProducts.length > 0 ? 'Tous les produits' : 'Produits disponibles'}
          </h2>
          <ProductGrid products={filteredProducts} onProductClick={onProductClick} />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
};

export default HomeView;