import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  List,
  ShoppingCart,
  CreditCard,
  Target,
  Workflow,
  BarChart3,
  Wallet,
  Plug,
  User,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quick-add', icon: Plus, label: 'Lançar' },
  { to: '/transactions', icon: List, label: 'Lançamentos' },
  { to: '/purchases', icon: ShoppingCart, label: 'Compras' },
  { to: '/cards', icon: CreditCard, label: 'Cartões' },
  { to: '/budgets', icon: Target, label: 'Orçamentos' },
  { to: '/rules', icon: Workflow, label: 'Regras' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  { to: '/accounts', icon: Wallet, label: 'Contas' },
  { to: '/integrations', icon: Plug, label: 'Integrações' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn(!open && 'hidden')}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          active && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.label}</span>}
                        {open && active && <ChevronRight className="ml-auto h-4 w-4" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
