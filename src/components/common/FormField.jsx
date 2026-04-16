import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import './FormField.css';

export const FormField = forwardRef((props, ref) => {
  const { label, error, hint, className, as = 'input', ...rest } = props;
  
  // Refined classes for deeper glassmorphism and smoother focus rings
  const sharedClasses =
    'w-full rounded-[18px] border border-white/10 bg-[#0a0a0e] px-5 py-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 hover:bg-[#13131a] focus:bg-[#0a0a0e] focus:border-orange-500/40 focus:ring-4 focus:ring-orange-500/10 shadow-inner';

  return (
    <label className="flex w-full flex-col gap-2 form-field-container">
      {/* Label */}
      {label && (
        <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/50 ml-1">
          {label}
        </span>
      )}
      
      {/* Input / Textarea */}
      {as === 'textarea' ? (
        <textarea 
          ref={ref}
          className={cn(
            sharedClasses, 
            'min-h-[120px] resize-none', 
            error && '!border-red-500/40 focus:!ring-red-500/10',
            className
          )} 
          style={{ colorScheme: 'dark' }}
          {...rest} 
        />
      ) : (
        <input 
          ref={ref}
          className={cn(
            sharedClasses, 
            error && '!border-red-500/40 focus:!ring-red-500/10',
            className
          )} 
          style={{ colorScheme: 'dark' }}
          {...rest} 
        />
      )}
      
      {/* Footer Info */}
      <div className="min-h-[1.25rem] px-1">
        {error ? (
          <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 shake">
             {error}
          </span>
        ) : hint ? (
          <span className="text-[11px] font-medium text-white/30">{hint}</span>
        ) : null}
      </div>
    </label>
  );
});

FormField.displayName = 'FormField';