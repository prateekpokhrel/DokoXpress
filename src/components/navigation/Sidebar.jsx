import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAV } from '@/utils/routes';
import { cn } from '@/utils/cn';
import './Sidebar.css';

export function Sidebar({ role }) {
  return (
    <aside style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      className="relative flex h-full flex-col rounded-[24px] border p-5 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="mb-8 rounded-[18px] px-5 py-5 border"
        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
          Workspace
        </p>
        <p className="mt-1 font-display text-xl font-bold tracking-tight text-orange-500">
          DokoXpress
        </p>
      </div>

      {/* Nav */}
      <nav className="space-y-1.5">
        {DASHBOARD_NAV[role].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200',
                  isActive
                    ? 'bg-orange-50 text-orange-500 border border-orange-200 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    'rounded-lg p-1.5 transition-colors',
                    isActive ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                  )}>
                    <Icon className="h-[16px] w-[16px]" />
                  </div>
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto rounded-[18px] p-4 border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600">System Ready</p>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          Spring Boot + JWT · MySQL connected
        </p>
      </div>
    </aside>
  );
}