import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, MessageSquare, Building2, Map, Activity, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/campaigns',
      label: 'Active Campaigns',
      icon: Target,
    },
    {
      path: '/center-wise',
      label: 'Center-wise',
      icon: Building2,
    },
    {
      path: '/mapping',
      label: 'Mapping',
      icon: Map,
    },
    {
      path: '/chat',
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      path: '/activity',
      label: 'Activity',
      icon: Activity,
    },
  ];

  if (profile?.access_level === 'admin') {
    navItems.push({
      path: '/admin',
      label: 'Admin',
      icon: Shield,
    });
  }

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/STALK LOGO.png" alt="Nova IVF" className="h-10 w-auto" />
            <span className="text-xl font-bold text-primary">MarketingHub</span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-primary-light hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-primary-light hover:text-primary transition-all ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
