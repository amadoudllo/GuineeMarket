import React, { useState } from 'react';
import { Search, X, Filter, TrendingUp } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingSearches = [
    'iPhone',
    'Toyota Camry',
    'Robes traditionnelles',
    'MacBook',
    'Samsung Galaxy',
    'Services de plomberie'
  ];

  const recentSearches = [
    'iPhone 14 Pro',
    'Voiture d\'occasion Conakry',
    'Meubles salon'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-xl shadow-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {!searchTerm ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recherches récentes</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Recherches populaires</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Search Results would go here */}
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Recherche en cours pour "{searchTerm}"...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;