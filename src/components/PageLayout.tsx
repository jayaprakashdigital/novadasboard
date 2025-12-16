import { ReactNode } from 'react';
import { useSidebar } from '../contexts/SidebarContext';

interface PageLayoutProps {
  children: ReactNode;
  hasFilterSidebar?: boolean;
}

export default function PageLayout({ children, hasFilterSidebar = false }: PageLayoutProps) {
  const { isExpanded } = useSidebar();

  const getMargin = () => {
    if (hasFilterSidebar) {
      return isExpanded ? 'lg:ml-[352px]' : 'lg:ml-[352px]';
    }
    return isExpanded ? 'lg:ml-64' : 'lg:ml-16';
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-16 transition-all duration-300 ${getMargin()}`}
    >
      {children}
    </div>
  );
}
