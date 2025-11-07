import { useEffect, useState } from 'react';
import { Users, Shield, Edit2, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  access_level: string;
  is_active: boolean;
  created_at: string;
}

const accessLevels = [
  { value: 'admin', label: 'Admin Access', description: 'Full access to all features' },
  { value: 'manager', label: 'Manager Access', description: 'Dashboard, Campaigns, Center-wise Data' },
  { value: 'viewer', label: 'Viewer Access', description: 'Dashboard only (read-only)' },
];

const accessLevelBadges: Record<string, string> = {
  admin: 'bg-primary text-white',
  manager: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-700',
};

export default function UserAccess() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccess = async (userId: string, newAccessLevel: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ access_level: newAccessLevel })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, access_level: newAccessLevel } : u));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating access:', error);
      alert('Failed to update user access');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update user status');
    }
  };

  const getAccessDescription = (level: string) => {
    return accessLevels.find(a => a.value === level)?.description || 'Unknown access level';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:ml-64 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">User Access Management</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">Manage user permissions and access levels</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Access Levels</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accessLevels.map((level) => (
                <div key={level.value} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900">{level.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Users ({users.length})</h2>
            </div>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedAccess}
                            onChange={(e) => setSelectedAccess(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            {accessLevels.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateAccess(user.id, selectedAccess)}
                            className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${accessLevelBadges[user.access_level] || 'bg-gray-100 text-gray-700'}`}>
                            {user.access_level}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{getAccessDescription(user.access_level)}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {editingUser !== user.id && (
                        <button
                          onClick={() => {
                            setEditingUser(user.id);
                            setSelectedAccess(user.access_level);
                          }}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-primary hover:bg-primary-light rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{user.full_name}</h3>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(user.id, user.is_active)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Access Level</span>
                    {editingUser === user.id ? (
                      <div className="space-y-2">
                        <select
                          value={selectedAccess}
                          onChange={(e) => setSelectedAccess(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {accessLevels.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateAccess(user.id, selectedAccess)}
                            className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${accessLevelBadges[user.access_level] || 'bg-gray-100 text-gray-700'}`}>
                          {user.access_level}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{getAccessDescription(user.access_level)}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Created</span>
                    <span className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>

                  {editingUser !== user.id && (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setSelectedAccess(user.access_level);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary bg-primary-light rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Access Level
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
