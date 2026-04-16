import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import './Button.css';

const variantStyles = {
  primary: 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
  secondary: 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] border-none',
  ghost: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white',
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