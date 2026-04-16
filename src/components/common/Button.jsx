import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import './Button.css';

const variantStyles = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
  secondary: 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-sm border-none',
  ghost: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300',
  danger: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white',
};

export function Button({ children, className, variant = 'primary', loading = false, fullWidth = false, disabled, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-bold tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]',
        variantStyles[variant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}