import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import './SelectField.css';

export function SelectField({ label, options, error, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && (
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-0.5">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full appearance-none rounded-[12px] border px-4 py-3 pr-10 text-sm outline-none transition-all duration-200',
            className,
          )}
          style={{
            backgroundColor: '#f8fbfc',
            borderColor: error ? '#fca5a5' : '#e2eaed',
            color: '#1a1a2e',
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ backgroundColor: '#ffffff', color: '#1a1a2e' }}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="min-h-[1.1rem] px-0.5">
        {error ? (
          <span className="text-[11px] font-semibold text-red-500 flex items-center gap-1 shake">{error}</span>
        ) : null}
      </div>
    </label>
  );
}
