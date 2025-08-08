import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Shield, UserX, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/formatters';
import { User } from '../../types';

const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'vendor' | 'admin'>('all');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: User[] = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        verified: user.verified,
        createdAt: new Date(user.created_at)
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'vendor': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'vendor': return 'Vendeur';
      case 'client': return 'Client';
      default: return role;
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    console.log(`${action} user ${userId}`);
    setActiveDropdown(null);
    // Here you would implement the actual actions
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl text-gray-400">👥</span>
          </div>
          <p className="text-gray-500">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
            <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all">
            <UserPlus className="h-5 w-5" />
            <span>Ajouter utilisateur</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="vendor">Vendeurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rôle</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Localisation</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date d'inscription</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.verified ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-gray-900">
                        {user.verified ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>

                      {activeDropdown === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => handleUserAction('edit', user.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={() => handleUserAction('verify', user.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Shield className="h-4 w-4" />
                            <span>{user.verified ? 'Retirer vérification' : 'Vérifier'}</span>
                          </button>
                          <button
                            onClick={() => handleUserAction('delete', user.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">👥</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersView;