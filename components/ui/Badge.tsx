import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  brand: {
    container: 'bg-brand-subtle text-brand border-brand/20',
    dot: 'bg-brand',
  },
  success: {
    container: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
  warning: {
    container: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dot: 'bg-amber-500',
  },
  danger: {
    container: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
  },
  info: {
    container: 'bg-blue-50 text-blue-700 border-blue-200/80',
    dot: 'bg-blue-500',
  },
  neutral: {
    container: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] font-bold rounded-md gap-1.5',
  md: 'px-2.5 py-1 text-xs font-bold rounded-lg gap-2',
};

export function Badge({
  className,
  variant = 'neutral',
  size = 'sm',
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const currentVariant = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center border font-sans select-none tracking-tight',
        currentVariant.container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              currentVariant.dot
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              currentVariant.dot
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
