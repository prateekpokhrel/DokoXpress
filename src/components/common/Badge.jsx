import { cn } from '@/utils/cn';
import './Badge.css';

const badgeStyles = {
  neutral: 'bg-white/10 text-white border-white/10',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider', badgeStyles[variant], className)}>
      {children}
    </span>
  );
}