import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Topbar } from '@/components/Topbar';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppLayout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!isMobile && <AppSidebar />}
        
        <div className="flex flex-1 flex-col w-full">
          <Topbar />
          
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>

        {isMobile && <BottomTabBar />}
      </div>
    </SidebarProvider>
  );
}
