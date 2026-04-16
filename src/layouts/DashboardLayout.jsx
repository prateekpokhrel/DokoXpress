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

  if (!role || !user) return null;

  const displayName = user?.fullName || user?.name || 'User';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-6">

        {/* SIDEBAR */}
        <div className={cn(
          'fixed inset-y-4 left-4 z-50 w-[260px] transition-transform duration-500 ease-out lg:static lg:inset-auto lg:w-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
        )}>
          <Sidebar role={role} />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
            aria-label="Close sidebar"
          />
        )}

        {/* MAIN */}
        <div className="flex min-w-0 flex-col gap-6">

          {/* Header */}
          <header style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            className="relative flex flex-wrap items-center justify-between gap-4 rounded-[24px] border px-6 py-4 shadow-sm z-30">

            <div className="flex items-center gap-3">
              <Button
                className="lg:hidden border text-slate-600 hover:bg-slate-50"
                onClick={() => setSidebarOpen(true)}
                type="button"
                variant="ghost"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link
                className="font-display text-xl font-bold tracking-tight text-orange-500 hover:text-orange-600 transition-colors"
                to="/"
              >
                DokoXpress
              </Link>

              <span className="hidden sm:inline-block rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-500">
                {ROLE_LABELS[role]}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden rounded-full border px-4 py-2 text-right md:block shadow-sm"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}>
                <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{displayName}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>

              <Button
                className="rounded-full bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 font-semibold px-4"
                onClick={() => { logout(); navigate('/login'); }}
                type="button"
                variant="ghost"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="min-h-[calc(100vh-120px)] w-full pb-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}