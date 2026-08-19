'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090A0F] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none rounded-lg active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#10B981] hover:bg-[#059669] text-white focus:ring-[#10B981]/50 shadow-sm shadow-[#10B981]/20',
      secondary:
        'bg-[#1A1F2E] hover:bg-[#252D42] text-[#F3F4F6] border border-[#2B3349] focus:ring-slate-400/30',
      outline:
        'bg-transparent hover:bg-[#171B2B] text-[#D1D5DB] border border-[#2E364F] hover:border-[#424D70] focus:ring-[#10B981]/40',
      ghost:
        'bg-transparent hover:bg-[#171B2B] text-[#9CA3AF] hover:text-[#F3F4F6] focus:ring-slate-500/20',
      danger:
        'bg-[#EF4444] hover:bg-[#DC2626] text-white focus:ring-[#EF4444]/40 shadow-sm shadow-[#EF4444]/20',
      gold:
        'bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-slate-950 font-semibold focus:ring-[#F59E0B]/50 shadow-md shadow-[#F59E0B]/20',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 gap-2 h-9.5',
      lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
