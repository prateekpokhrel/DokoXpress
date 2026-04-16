import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import './FormField.css';

export const FormField = forwardRef((props, ref) => {
  const { label, error, hint, className, as = 'input', ...rest } = props;

  const sharedClasses =
    'w-full rounded-[12px] border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-slate-400';

  const baseStyle = {
    backgroundColor: '#f8fbfc',
    borderColor: error ? '#fca5a5' : '#e2eaed',
    color: '#1a1a2e',
  };

  return (
    <label className="flex w-full flex-col gap-1.5 form-field-container">
      {label && (
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-0.5">
          {label}
        </span>
      )}

      {as === 'textarea' ? (
        <textarea
          ref={ref}
          className={cn(sharedClasses, 'min-h-[110px] resize-none', className)}
          style={baseStyle}
          {...rest}
        />
      ) : (
        <input
          ref={ref}
          className={cn(sharedClasses, className)}
          style={baseStyle}
          {...rest}
        />
      )}

      <div className="min-h-[1.1rem] px-0.5">
        {error ? (
          <span className="text-[11px] font-semibold text-red-500 flex items-center gap-1 shake">
            {error}
          </span>
        ) : hint ? (
          <span className="text-[11px] text-slate-400">{hint}</span>
        ) : null}
      </div>
    </label>
  );
});

FormField.displayName = 'FormField';