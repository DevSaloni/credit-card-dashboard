'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Gift, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRewards } from '@/context/RewardContext';
import { formatNumber } from '@/lib/formatters';

export function MobileNavigation() {
  const pathname = usePathname();
  const { balance } = useRewards();

  const items = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
      isActive: pathname === '/dashboard' || pathname === '/',
    },
    {
      href: '/dashboard#transactions-section',
      label: 'Transactions',
      icon: ArrowLeftRight,
      isActive: false,
    },
    {
      href: '/rewards',
      label: 'Rewards',
      icon: Gift,
      badge: formatNumber(balance),
      isActive: pathname === '/rewards',
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#0C0F17]/95 backdrop-blur-lg border-t border-[#1E2538] px-4 py-2 safe-area-pb">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative',
                item.isActive
                  ? 'text-[#10B981]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-bold bg-[#F59E0B] text-slate-950 px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
