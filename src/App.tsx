import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import MobileBottomNav from './components/Layout/MobileBottomNav';
import SearchModal from './components/Search/SearchModal';
import AuthModal from './components/Auth/AuthModal';
import HomeView from './components/Views/HomeView';
import AddProductView from './components/Views/AddProductView';
import MyProductsView from './components/Views/MyProductsView';
import AdminUsersView from './components/Views/AdminUsersView';
import AdminProductsView from './components/Views/AdminProductsView';
import { Product } from './types';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">GN</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
          <p className="text-sm text-gray-500 mt-2">Si le chargement persiste, vérifiez votre configuration Supabase</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">GN</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">GuinéeMarket</h1>
          <p className="text-gray-600 mb-8">
            La marketplace de référence en Guinée. Achetez et vendez en toute sécurité.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all"
          >
            Se connecter / S'inscrire
          </button>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }
  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    // Here you would navigate to product detail view
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onProductClick={handleProductClick} />;
      case 'add-product':
        return <AddProductView />;
      case 'my-products':
        return <MyProductsView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-products':
        return <AdminProductsView />;
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tableau de bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mes annonces</h3>
                <p className="text-3xl font-bold text-red-600">-</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vues totales</h3>
                <p className="text-3xl font-bold text-green-600">-</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
                <p className="text-3xl font-bold text-blue-600">-</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Mon profil</h1>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-600">Fonctionnalité de profil en cours de développement...</p>
            </div>
          </div>
        );
      default:
        return <HomeView onProductClick={handleProductClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchModalOpen(true)}
        user={user}
        onAuthClick={() => setAuthModalOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          currentView={currentView}
          onViewChange={setCurrentView}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={setCurrentView}
        onSearchClick={() => setSearchModalOpen(true)}
        user={user}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;