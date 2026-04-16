import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/constants';
import { cn } from '@/utils/cn';
import './DashboardLayout.css';

export function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!role || !user) {
    return null;
  }

  return (
    // Base wrapper set to pure dark (#050507) to kill any remaining sand/light backgrounds
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        
        {/* ================= SIDEBAR WRAPPER ================= */}
        <div 
          className={cn(
            'fixed inset-y-4 left-4 z-50 w-[280px] transition-transform duration-500 ease-out lg:static lg:inset-auto lg:w-auto', 
            sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
          )}
        >
          <Sidebar role={role} />
        </div>

        {/* Mobile Frosted Glass Overlay */}
        {sidebarOpen ? (
          <button 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden fade-in" 
            onClick={() => setSidebarOpen(false)} 
            type="button" 
            aria-label="Close sidebar"
          />
        ) : null}

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex min-w-0 flex-col gap-6">
          
          {/* Top Global Header (Floating Dark Glass) */}
          <header className="dashboard-header-glow relative flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-[#0a0a0e] px-6 py-4 shadow-2xl z-30 overflow-hidden">
            {/* Subtle inner background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex items-center gap-4">
              <Button 
                className="lg:hidden bg-white/5 border border-white/10 text-white hover:bg-white/10" 
                onClick={() => setSidebarOpen(true)} 
                type="button" 
                variant="ghost"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Link className="font-display text-2xl font-bold tracking-tight text-white transition-colors hover:text-orange-400" to="/">
                DokoXpress
              </Link>
              
              {/* Role Badge */}
              <span className="hidden sm:inline-block rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                {ROLE_LABELS[role]}
              </span>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-4">
              {/* User Info Pill */}
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-5 py-2 text-right md:block shadow-inner backdrop-blur-md">
              <p className="text-sm font-bold text-white">{user.fullName}</p>
              </div>
              
              {/* Logout Button */}
              <Button
                className="rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-transparent transition-all font-semibold px-4"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                type="button"
                variant="ghost"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* ================= OUTLET (PAGE CONTENT) ================= */}
          <div className="min-h-[calc(100vh-120px)] w-full pb-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}