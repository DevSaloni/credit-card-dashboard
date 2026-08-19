'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightIcon, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[#6B7280]">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          value={value}
          className={cn(
            'w-full rounded-lg bg-[#121624] border border-[#20273A] text-sm text-[#F3F4F6] placeholder-[#6B7280]',
            'transition-all duration-150',
            'focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] focus:bg-[#151A2B]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'h-9.5 py-2',
            leftIcon ? 'pl-9.5' : 'pl-3.5',
            hasValue && onClear ? 'pr-9' : rightIcon ? 'pr-9.5' : 'pr-3.5',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-md text-[#6B7280] hover:text-[#D1D5DB] hover:bg-[#1F2637] transition-colors"
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {!hasValue && rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-[#6B7280]">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
