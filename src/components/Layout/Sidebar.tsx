import React from 'react';
import { Home, Package, Plus, Users, Settings, BarChart3, Shield, X } from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  onClose: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, onViewChange, onClose, user }) => {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, roles: ['client', 'vendor', 'admin'] },
    { id: 'my-products', label: 'Mes annonces', icon: Package, roles: ['vendor'] },
    { id: 'add-product', label: 'Publier une annonce', icon: Plus, roles: ['vendor'] },
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, roles: ['vendor'] },
    { id: 'admin-users', label: 'Gestion utilisateurs', icon: Users, roles: ['admin'] },
    { id: 'admin-products', label: 'Validation annonces', icon: Shield, roles: ['admin'] },
    { id: 'profile', label: 'Mon profil', icon: Settings, roles: ['client', 'vendor', 'admin'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left
                  ${currentView === item.id 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;