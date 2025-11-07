import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, BarChart3, MessageSquare, Building2, Map } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
      label: 'Center-wise Data',
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
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-indigo-800 border-b border-indigo-700 fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-indigo-900" />
            </div>
            <span className="text-xl font-bold text-white">MarketingHub</span>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    active
                      ? 'bg-white text-indigo-900'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
