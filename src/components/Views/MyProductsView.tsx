import React, { useState } from 'react';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice, formatDate, getCategoryLabel, getConditionLabel, getStatusLabel } from '../../utils/formatters';

const MyProductsView: React.FC = () => {
  const { user } = useAuth();
  const { products: allProducts, loading, deleteProduct } = useProducts();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Filter products by current vendor
  const myProducts = allProducts.filter(product => product.vendorId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = async (action: string, productId: string) => {
    setActiveDropdown(null);
    
    if (action === 'delete') {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
        try {
          await deleteProduct(productId);
          alert('Annonce supprimée avec succès');
        } catch (error: any) {
          alert(error.message || 'Erreur lors de la suppression');
        }
      }
    } else if (action === 'edit') {
      // TODO: Implement edit functionality
      alert('Fonctionnalité de modification en cours de développement');
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-gray-400">📦</span>
          </div>
          <p className="text-gray-500">Chargement de vos annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes annonces</h1>
        <p className="text-gray-600">Gérez vos produits publiés</p>
      </div>

      {myProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce</h3>
          <p className="text-gray-500 mb-4">Vous n'avez pas encore publié d'annonces.</p>
          <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all">
            Publier ma première annonce
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myProducts.map((product) => (
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{getCategoryLabel(product.category)}</span>
                        <span>•</span>
                        <span>{getConditionLabel(product.condition)}</span>
                        <span>•</span>
                        <span>{product.location}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-red-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusLabel(product.status)}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">{product.views} vues</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>

                      {activeDropdown === product.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => handleAction('edit', product.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleAction('delete', product.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Publié le {formatDate(product.createdAt)}</span>
                      <span>Modifié le {formatDate(product.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProductsView;