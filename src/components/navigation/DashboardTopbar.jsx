import { Bell, MapPin, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS } from '@/utils/constants';
import { Button } from '@/components/common/Button';
import './DashboardTopbar.css';

export function DashboardTopbar({ title, subtitle, action, onCartClick, cartCount = 0 }) {
  const { user, role } = useAuth();

  return (
    <div
      className="topbar-glow relative flex flex-col gap-5 rounded-[32px] border p-6 md:flex-row md:items-center md:justify-between overflow-hidden shadow-sm"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >

      {/* Subtle inner ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.01),transparent_50%)] pointer-events-none" />

      {/* Left: Titles */}
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500 mb-1 drop-shadow-sm">
          {role ? ROLE_LABELS[role] : 'Workspace'}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>{title}</h1>
        <p className="mt-2 text-sm font-medium max-w-xl" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
      </div>

      {/* Right: Actions */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">

        {/* Location Pill */}
        <div
          className="hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold lg:flex"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
        >
          <MapPin className="h-4 w-4 text-orange-500" />
          {user?.city || user?.address?.city || user?.storeAddress?.city || 'Nepal'}
        </div>

        {/* Shopping Cart (Conditional) */}
        {onCartClick ? (
          <Button
            className="relative rounded-full border transition-all hover:bg-slate-100 px-5 py-2 font-semibold"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
            onClick={onCartClick}
            type="button"
            variant="ghost"
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-slate-500" />
            Cart
            {cartCount ? (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            ) : null}
          </Button>
        ) : null}

        {/* Custom Action (Passed as prop) */}
        {action}

        {/* Notification Bell */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:bg-slate-100"
          style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
          type="button"
        >
          <Bell className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}