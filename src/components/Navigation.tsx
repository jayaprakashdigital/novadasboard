import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, MessageSquare, Building2, Map, Activity, Calculator, Shield, LogOut, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    {
      path: '/tools',
      label: 'Tools',
      icon: Calculator,
    },
  ];

  if (profile?.access_level === 'admin') {
    navItems.push(
      {
        path: '/user-access',
        label: 'User Access',
        icon: Shield,
      },
      {
        path: '/user-management',
        label: 'User Management',
        icon: Users,
      },
      {
        path: '/admin',
        label: 'Admin',
        icon: Shield,
      }
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/NOVA IVF Logo.png" alt="Nova IVF" className="h-10 w-auto" />
            <span className="text-xl font-bold text-gray-900">JP Dashboard</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}

            <div className="flex items-center gap-2 ml-4">
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
