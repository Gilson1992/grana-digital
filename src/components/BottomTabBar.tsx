import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Plus, List, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quick-add', icon: Plus, label: 'Lançar' },
  { to: '/transactions', icon: List, label: 'Lançamentos' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

export function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                'min-w-[44px] touch-manipulation',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-5 w-5', isActive && 'fill-current')} />
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
