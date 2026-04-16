import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { DASHBOARD_HOME, ROLE_LABELS } from '@/utils/constants';
import './PublicNavbar.css';

export function PublicNavbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.fullName || user?.name || '';

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300"
      style={{ backgroundColor: 'rgba(244,250,251,0.95)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link className="group flex items-center gap-3 transition-transform hover:scale-[1.02]" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 to-pink-600 font-display text-lg font-black text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            DX
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-orange-500 transition-colors group-hover:text-orange-600">
              DokoXpress
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Multi-vendor commerce
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 text-sm font-bold tracking-wide md:flex" style={{ color: 'var(--text-muted)' }}>
          <NavLink
            className={({ isActive }) => `transition-colors hover:text-orange-500 ${isActive ? 'text-orange-500' : ''}`}
            to="/"
          >Home</NavLink>
          <NavLink
            className={({ isActive }) => `transition-colors hover:text-orange-500 ${isActive ? 'text-orange-500' : ''}`}
            to="/login"
          >Login</NavLink>
          <NavLink
            className={({ isActive }) => `transition-colors hover:text-orange-500 ${isActive ? 'text-orange-500' : ''}`}
            to="/signup"
          >Signup</NavLink>
        </nav>

        {/* ACTIONS */}
        {user && role ? (
          <div className="flex items-center gap-3">
            <div
              className="hidden rounded-[14px] border px-4 py-2 text-right md:block"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
              <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>{displayName}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">{ROLE_LABELS[role]}</p>
            </div>

            <Button
              onClick={() => navigate(DASHBOARD_HOME[role])}
              className="border font-semibold text-slate-700 hover:bg-slate-100"
              variant="ghost"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Button
              className="px-3 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100"
              onClick={() => { logout(); navigate('/login'); }}
              variant="ghost"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/login')}
              className="font-semibold text-slate-700 hover:bg-slate-100 border border-transparent"
              variant="ghost"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-[1.05] font-bold px-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}