import { ReactNode } from 'react';
import { ThreadList } from './ThreadList';
import { useUIStore } from '@/store/uiStore';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar}>
        <ThreadList />
      </Sidebar>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="z-10">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 relative h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
