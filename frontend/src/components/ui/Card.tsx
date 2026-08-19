import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hoverEffect?: boolean;
}

export function Card({ className, elevated = false, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        elevated
          ? 'bg-[#151926] border-[#252D40] shadow-lg shadow-black/40'
          : 'bg-[#111420] border-[#1F2637]',
        hoverEffect && 'hover:border-[#333E59] hover:bg-[#161A28]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pb-3 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-medium tracking-tight text-[#9CA3AF]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pt-3 border-t border-[#1F2637]', className)} {...props}>
      {children}
    </div>
  );
}
