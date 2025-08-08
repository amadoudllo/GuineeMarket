import React from 'react';
import { Home, Search, Plus, User, Package } from 'lucide-react';
import { User as UserType } from '../../types';

interface MobileBottomNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onSearchClick: () => void;
  user: UserType;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onViewChange, onSearchClick, user }) => {
  const getNavItems = () => {
    const baseItems = [
      { id: 'home', label: 'Accueil', icon: Home },
      { id: 'search', label: 'Recherche', icon: Search, isSearch: true },
    ];

    if (user.role === 'vendor') {
      return [
        ...baseItems,
        { id: 'add-product', label: 'Publier', icon: Plus },
        { id: 'my-products', label: 'Annonces', icon: Package },
        { id: 'profile', label: 'Profil', icon: User },
      ];
    }

    return [
      ...baseItems,
      { id: 'profile', label: 'Profil', icon: User },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => item.isSearch ? onSearchClick() : onViewChange(item.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0
                ${isActive 
                  ? 'text-red-600' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-red-600' : ''}`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;