import React, { useState } from 'react';
import { Search, Check, X, Eye } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice, formatDate, getCategoryLabel, getConditionLabel } from '../../utils/formatters';

const AdminProductsView: React.FC = () => {
  const { products: allProducts, loading, updateProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleProductAction = async (action: 'approve' | 'reject', productId: string) => {
    try {
      await updateProduct(productId, {
        status: action === 'approve' ? 'approved' : 'rejected'
      });
      alert(`Annonce ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès!`);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = allProducts.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-gray-400">📋</span>
          </div>
          <p className="text-gray-500">Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Validation des annonces</h1>
            <p className="text-gray-600">
              Approuvez ou rejetez les annonces en attente
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {pendingCount} en attente
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher par titre ou vendeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="all">Toutes</option>
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              {/* Product Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status === 'pending' ? 'En attente' : product.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{getCategoryLabel(product.category)}</span>
                      <span>•</span>
                      <span>{getConditionLabel(product.condition)}</span>
                      <span>•</span>
                      <span>{product.location}</span>
                      <span>•</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Vendor Info */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{product.vendor.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-600">{product.vendor.name}</span>
                      <span className="text-sm text-gray-500">({product.vendor.phone})</span>
                      {product.vendor.verified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      Publié le {formatDate(product.createdAt)} • {product.views} vues
                    </div>
                  </div>

                  {/* Actions */}
                  {product.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleProductAction('approve', product.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => handleProductAction('reject', product.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Rejeter</span>
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
          <p className="text-gray-500">
            {filterStatus === 'pending' 
              ? 'Aucune annonce en attente de validation.' 
              : 'Essayez de modifier vos critères de recherche.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminProductsView;