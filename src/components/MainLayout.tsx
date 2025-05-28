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
        <Header toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}
