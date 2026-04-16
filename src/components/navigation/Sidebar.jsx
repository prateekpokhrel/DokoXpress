import { NavLink } from 'react-router-dom';
import { DASHBOARD_NAV } from '@/utils/routes';
import { cn } from '@/utils/cn';
import './Sidebar.css';

export function Sidebar({ role }) {
  return (
    <aside className="sidebar-glow relative flex h-full flex-col rounded-[32px] border border-white/10 bg-[#0a0a0e] p-5 overflow-hidden">
      
      {/* Top Ambient Glow inside the sidebar */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.08),transparent_50%)] pointer-events-none" />

      {/* Header/Logo Block */}
      <div className="relative z-10 mb-8 rounded-[24px] bg-black/40 border border-white/5 px-5 py-6 shadow-inner backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 drop-shadow-sm">
          Workspace
        </p>
        <p className="mt-1 font-display text-2xl font-bold tracking-tight text-white drop-shadow-md">
          DokoXpress
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 space-y-3">
        {DASHBOARD_NAV[role].map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-4 rounded-[18px] px-4 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 border',
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                    : 'border-transparent text-white/50 hover:bg-white/5 hover:text-white/90 hover:border-white/10'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon Wrapper for extra polish */}
                  <div 
                    className={cn(
                      "rounded-xl p-1.5 transition-colors duration-300",
                      isActive 
                        ? "bg-orange-500/20 text-orange-400" 
                        : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/90"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Information Card */}
      <div className="relative z-10 mt-auto rounded-[24px] bg-white/5 border border-white/10 p-5 backdrop-blur-md shadow-inner transition-colors hover:bg-white/10 cursor-default">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-white">System Ready</p>
        </div>
        <p className="text-xs leading-relaxed text-white/50 font-medium">
          API boundaries are securely organized for Spring Boot & JWT workflows.
        </p>
      </div>
    </aside>
  );
}