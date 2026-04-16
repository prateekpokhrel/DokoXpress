import { Badge } from '@/components/common/Badge';
import { DEFAULT_PASSWORD_HINT } from '@/utils/constants';
import './AccessCredentialsCard.css';

export function AccessCredentialsCard() {
  return (
    // Bypassed your <Card> component completely to ensure a pure dark background without white bleed
    <div className="rounded-[24px] bg-black/40 border border-white/10 p-6 text-white backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-400 drop-shadow-sm">
            Quick Access
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-white">Platform credentials</h3>
        </div>
        <Badge className="bg-white/10 border border-white/10 text-white shadow-sm px-3 py-1" variant="neutral">
          Password: <span className="text-orange-300 ml-1 font-mono tracking-wider">{DEFAULT_PASSWORD_HINT}</span>
        </Badge>
      </div>
      
      <div className="mt-6 grid gap-3 text-sm text-white/70">
        <div className="group rounded-[16px] bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/10 cursor-default">
          <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Customer</p>
          <p className="font-mono text-orange-200/80 tracking-tight">ava.customer@dokoxpress.com</p>
        </div>
        
        <div className="group rounded-[16px] bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/10 cursor-default">
          <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Vendor</p>
          <p className="font-mono text-teal-200/80 tracking-tight">milan.vendor@dokoxpress.com</p>
        </div>
        
        <div className="group rounded-[16px] bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/10 cursor-default">
          <p className="font-bold text-white text-xs uppercase tracking-wider mb-1">Admin</p>
          <p className="font-mono text-purple-200/80 tracking-tight">admin@dokoxpress.com</p>
        </div>
      </div>
    </div>
  );
}