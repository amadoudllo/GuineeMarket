import React from 'react';
import { Search, Bell, Menu, User, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { User as UserType } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  user: UserType;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onSearchClick, user, onAuthClick }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GN</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">GuinéeMarket</span>
            </div>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden transition-colors"
            >
              <Search className="h-6 w-6 text-gray-600" />
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="relative group">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role === 'client' ? 'Client' : user.role === 'vendor' ? 'Vendeur' : 'Administrateur'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;