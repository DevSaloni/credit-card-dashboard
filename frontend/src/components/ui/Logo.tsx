import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function SpendlyLogoIcon({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="spendlyGrad1" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="0.5" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="spendlyGrad2" x1="16" y1="8" x2="28" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Modern Fintech S-Monogram / Dual Loop */}
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#0C101A" stroke="#222A3E" strokeWidth="1.5" />
      
      {/* Upper Loop */}
      <path
        d="M21 11.5C21 9.567 19.433 8 17.5 8H13C10.7909 8 9 9.79086 9 12C9 14.2091 10.7909 16 13 16H19C21.2091 16 23 17.7909 23 20C23 22.2091 21.2091 24 19 24H14.5C12.567 24 11 22.433 11 20.5"
        stroke="url(#spendlyGrad1)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Modern Credit Card Chip / Dot Accent */}
      <circle cx="21" cy="11.5" r="1.5" fill="#34D399" />
      <circle cx="11" cy="20.5" r="1.5" fill="#38BDF8" />
    </svg>
  );
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 32, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 40, text: 'text-2xl', sub: 'text-xs' },
  };

  const current = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-3 select-none group', className)}>
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#10B981]/30 to-[#06B6D4]/30 blur-sm group-hover:blur-md transition-all" />
        <SpendlyLogoIcon size={current.icon} className="relative z-10 drop-shadow-md" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-extrabold tracking-tight text-[#F9FAFB] group-hover:text-white transition-colors leading-none', current.text)}>
            SPENDLY
          </span>
          <span className={cn('text-[#9CA3AF] font-semibold tracking-wider uppercase mt-1', current.sub)}>
            Your money, understood.
          </span>
        </div>
      )}
    </div>
  );
}
