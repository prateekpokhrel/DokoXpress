import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAV } from '@/utils/routes';
import { cn } from '@/utils/cn';
import './Sidebar.css';

export function Sidebar({ role }) {
  return (
    <aside style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      className="relative flex h-full flex-col rounded-[40px] border p-4 shadow-2xl overflow-hidden sidebar-glass">

      {/* Header */}
      <div className="mb-6 rounded-[30px] px-6 py-6 border transition-all duration-300 hover:shadow-lg"
        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
          Workspace
        </p>
        <p className="font-display text-lg font-black tracking-tight text-slate-800">
          Doko<span className="text-orange-500">Xpress</span>
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
                  'group flex items-center gap-3 rounded-[20px] px-5 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 border-2',
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-[0_10px_20px_rgba(249,115,22,0.2)]'
                    : 'text-ink opacity-40 border-transparent hover:bg-white hover:opacity-100 hover:shadow-sm'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-300 group-hover:text-orange-500")} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto rounded-[30px] p-6 border bg-gradient-to-br from-slate-50 to-transparent" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Doko Xpress</p>
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-slate-400">
          नेपालको बजार, अब तपाईंको मोबाइलमा.
        </p>
      </div>
    </aside>
  );
}