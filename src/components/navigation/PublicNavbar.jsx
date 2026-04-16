import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { DASHBOARD_HOME, ROLE_LABELS } from '@/utils/constants';
import './PublicNavbar.css';

export function PublicNavbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        
        {/* ================= LOGO ================= */}
        <Link className="group flex items-center gap-3 transition-transform hover:scale-[1.02]" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 to-pink-600 font-display text-lg font-black text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            DX
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white transition-colors group-hover:text-orange-400">
              DokoXpress
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
              Multi-vendor commerce
            </p>
          </div>
        </Link>

        {/* ================= DESKTOP NAV LINKS ================= */}
        <nav className="hidden items-center gap-8 text-sm font-bold tracking-wide text-white/60 md:flex">
          <NavLink className={({ isActive }) => `nav-link transition-colors hover:text-white ${isActive ? 'text-orange-400 active' : ''}`} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link transition-colors hover:text-white ${isActive ? 'text-orange-400 active' : ''}`} to="/login">
            Login
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link transition-colors hover:text-white ${isActive ? 'text-orange-400 active' : ''}`} to="/signup">
            Signup
          </NavLink>
        </nav>

        {/* ================= ACTIONS ================= */}
        {user && role ? (
          <div className="flex items-center gap-4">
            <div className="hidden rounded-[16px] border border-white/10 bg-white/5 px-4 py-2 text-right backdrop-blur-md md:block shadow-inner">
              <p className="text-sm font-bold text-white">{user.fullName}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-400">{ROLE_LABELS[role]}</p>
            </div>
            
            {/* Custom styled dashboard button */}
            <Button 
              onClick={() => navigate(DASHBOARD_HOME[role])} 
              className="bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md font-semibold transition-all"
            >
              Dashboard
            </Button>
            
            {/* Logout Button */}
            <Button
              className="px-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-transparent transition-all"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate('/login')} 
              className="text-white hover:bg-white/10 border-transparent transition-all font-semibold" 
              variant="ghost"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 text-white border-none shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] font-bold px-6"
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