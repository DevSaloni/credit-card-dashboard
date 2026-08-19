import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'failed' | 'pending' | 'neutral' | 'gold' | 'category';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border transition-colors';

  const variants = {
    success: 'bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30',
    failed: 'bg-[#EF4444]/10 text-[#F87171] border-[#EF4444]/30',
    pending: 'bg-[#F59E0B]/10 text-[#FBBF24] border-[#F59E0B]/30',
    neutral: 'bg-[#1F2637] text-[#9CA3AF] border-[#2A334A]',
    gold: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30 shadow-sm shadow-[#F59E0B]/10',
    category: 'bg-[#171B2B] text-[#D1D5DB] border-[#283046]',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5 font-semibold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-[#10B981]',
            variant === 'failed' && 'bg-[#EF4444]',
            variant === 'pending' && 'bg-[#F59E0B]',
            variant === 'gold' && 'bg-[#FBBF24]',
            variant === 'neutral' && 'bg-[#9CA3AF]'
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'SUCCESS' | 'FAILED' | string }) {
  if (status === 'SUCCESS') {
    return (
      <Badge variant="success" size="sm" className="font-semibold tracking-wide">
        <Check className="h-3 w-3 stroke-[2.5]" />
        <span>Paid</span>
      </Badge>
    );
  }

  if (status === 'FAILED') {
    return (
      <Badge variant="failed" size="sm" className="font-semibold tracking-wide">
        <X className="h-3 w-3 stroke-[2.5]" />
        <span>Failed</span>
      </Badge>
    );
  }

  return (
    <Badge variant="neutral" size="sm">
      <Sparkles className="h-3 w-3" />
      <span>{status}</span>
    </Badge>
  );
}
