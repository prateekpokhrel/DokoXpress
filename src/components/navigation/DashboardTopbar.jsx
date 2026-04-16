import { Bell, MapPin, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import './DashboardTopbar.css';

export function DashboardTopbar({ title, subtitle, action, onCartClick, cartCount = 0 }) {
  const { user, role } = useAuth();

  return (
    <div className="topbar-glow relative flex flex-col gap-5 rounded-[32px] border border-white/10 bg-[#0a0a0e] p-6 md:flex-row md:items-center md:justify-between overflow-hidden">
      
      {/* Subtle inner ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none" />
      
      {/* Left: Titles */}
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1 drop-shadow-sm">
          {role ? ROLE_LABELS[role] : 'Workspace'}
        </p>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-white/50 font-medium max-w-xl">{subtitle}</p>
      </div>

      {/* Right: Actions */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        
        {/* Location Pill */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-md lg:flex shadow-inner">
          <MapPin className="h-4 w-4 text-orange-400" />
          {user && 'address' in user ? user.address.city : user && 'storeAddress' in user ? user.storeAddress.city : 'City view'}
        </div>
        
        {/* Shopping Cart (Conditional) */}
        {onCartClick ? (
          <Button 
            className="relative rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 px-5 py-2 font-semibold shadow-inner" 
            onClick={onCartClick} 
            type="button" 
            variant="ghost"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-white/70" />
            Cart
            {cartCount ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                {cartCount}
              </span>
            ) : null}
          </Button>
        ) : null}
        
        {/* Custom Action (Passed as prop) */}
        {action}
        
        {/* Notification Bell */}
        <button 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white shadow-inner" 
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}