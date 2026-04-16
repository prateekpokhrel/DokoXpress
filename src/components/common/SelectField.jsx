import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import './SelectField.css';

export function SelectField({ label, options, error, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-coral focus:ring-4 focus:ring-orange-100',
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}
