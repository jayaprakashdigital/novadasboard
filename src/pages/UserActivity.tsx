import { useEffect, useState } from 'react';
import { Clock, User, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
  };
}

export default function UserActivity() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [profile]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('user_activity_logs')
        .select(`
          *,
          user_profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (profile?.access_level !== 'admin') {
        query = query.eq('user_id', profile?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'logout':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'create':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'update':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-pink-100 text-primary border-pink-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">User Activity Log</h1>
          </div>
          <p className="text-gray-600">
            {profile?.access_level === 'admin'
              ? 'View all user activities across the system'
              : 'Track your recent activities and actions'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  {profile?.access_level === 'admin' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User Agent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={profile?.access_level === 'admin' ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDate(activity.created_at)}
                        </div>
                      </td>
                      {profile?.access_level === 'admin' && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {activity.user_profiles?.full_name || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {activity.user_profiles?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(activity.action)}`}>
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md truncate">
                          {activity.details && Object.keys(activity.details).length > 0
                            ? JSON.stringify(activity.details)
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {activity.user_agent || '-'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {activities.length} activity logs
        </div>
      </div>
    </div>
  );
}
