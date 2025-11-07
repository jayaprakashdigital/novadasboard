import { ReactNode } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16 transition-all duration-300 ${
        isExpanded ? 'lg:ml-64' : 'lg:ml-16'
      }`}
    >
      {children}
    </div>
  );
}
