import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 tracking-tight"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {iconLeft}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-white border rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400',
              'transition-all duration-150 ease-out outline-none',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              iconLeft ? 'pl-9.5' : 'pl-3.5',
              iconRight ? 'pr-9.5' : 'pr-3.5',
              'py-2',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-[#5B4DFB] focus:ring-2 focus:ring-[#5B4DFB]/20',
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {iconRight}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-semibold text-rose-600 tracking-tight">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
