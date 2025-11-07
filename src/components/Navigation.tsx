import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, MessageSquare, Building2, Map, Activity, Calculator, Shield, LogOut, Users, Menu, X, ChevronDown, MoreHorizontal, UserCog } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Navigation() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        path: '/user-details',
        label: 'User Details',
        icon: UserCog,
      }
    );
  }

  const primaryNavItems = navItems.slice(0, 3);
  const moreNavItems = navItems.slice(3);

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/NOVA IVF Logo.png"
              alt="Nova IVF"
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}

            {moreNavItems.length > 0 && (
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all ${
                    moreNavItems.some(item => isActive(item.path))
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-sm">More</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {moreNavItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 font-medium transition-all ${
                            active
                              ? 'bg-primary/10 text-primary border-l-4 border-primary'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 ml-2 xl:ml-4 pl-2 xl:pl-4 border-l border-gray-300">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden xl:block">
                  <div className="text-sm font-medium text-gray-900">
                    {profile?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile?.access_level === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm shadow-md hover:shadow-lg transition-all">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-white hover:shadow-md transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 py-4">
            <div className="mb-4 p-4 bg-gradient-to-r from-primary/10 to-primary-dark/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900">
                    {profile?.full_name || 'User'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {profile?.email}
                  </div>
                  <div className="text-xs text-primary font-medium mt-0.5">
                    {profile?.access_level === 'admin' ? 'Administrator' : 'User'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
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
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
