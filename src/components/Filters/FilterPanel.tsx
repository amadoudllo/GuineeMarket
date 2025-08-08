import React from 'react';
import { Filter, X } from 'lucide-react';
import { ProductCategory } from '../../types';
import { getCategoryLabel } from '../../utils/formatters';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: ProductCategory | '';
    condition: 'new' | 'used' | '';
    minPrice: string;
    maxPrice: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, onFilterChange }) => {
  const categories: (ProductCategory | '')[] = ['', 'electronics', 'clothing', 'vehicles', 'furniture', 'services'];
  const locations = ['', 'Conakry', 'Kankan', 'Labé', 'Kindia', 'Boké', 'Faranah', 'Mamou', 'N\'Zérékoré'];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Filter Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        lg:relative lg:w-64 lg:translate-x-0 lg:shadow-none lg:border-l lg:border-gray-200
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-semibold text-lg">Filtres</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.slice(1).map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category as string)}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">État</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value=""
                  checked={filters.condition === ''}
                  onChange={(e) => onFilterChange({ ...filters, condition: e.target.value })}
                  className="mr-3 text-red-600"
                />
                <span className="text-sm">Tous</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={filters.condition === 'new'}
                  onChange={(e) => onFilterChange({ ...filters, condition: e.target.value })}
                  className="mr-3 text-red-600"
                />
                <span className="text-sm">Neuf</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={filters.condition === 'used'}
                  onChange={(e) => onFilterChange({ ...filters, condition: e.target.value })}
                  className="mr-3 text-red-600"
                />
                <span className="text-sm">Occasion</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Prix (GNF)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Localisation</label>
            <select
              value={filters.location}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Toute la Guinée</option>
              {locations.slice(1).map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => onFilterChange({
              category: '',
              condition: '',
              minPrice: '',
              maxPrice: '',
              location: ''
            })}
            className="w-full px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Effacer tous les filtres
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;