import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Target,
  Building2,
  Map,
  MessageSquare,
  Activity,
  Calculator,
  Shield,
  Users,
  UserCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems: NavItem[] = [
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
      label: 'User Activity',
      icon: Activity,
    },
    {
      path: '/tools',
      label: 'Marketing Tools',
      icon: Calculator,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: UserCircle,
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
      }
    );
  }

  return (
    <>
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 hidden lg:block ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors z-50"
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <nav className="flex-1 py-6 overflow-y-auto">
            <div className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!isExpanded ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    {isExpanded && (
                      <span className="font-medium text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}

                    {!isExpanded && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      <div className={`hidden lg:block transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-16'}`} />
    </>
  );
}
