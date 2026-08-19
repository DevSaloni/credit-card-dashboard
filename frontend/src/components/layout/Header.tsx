'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRewards } from '@/context/RewardContext';
import { formatNumber } from '@/lib/formatters';
import { Coins, LayoutDashboard, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  const pathname = usePathname();
  const { balance } = useRewards();

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/rewards', label: 'Rewards', icon: Gift },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2538] bg-[#090A0F]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/dashboard' && pathname === '/');
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#171B2B] text-[#F3F4F6] border border-[#252E44]'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#121624]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Area: Coin Balance Pill & User Profile */}
        <div className="flex items-center gap-3">
          {/* Glowing Coin Pill */}
          <Link
            href="/rewards"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181D2C] border border-[#F59E0B]/30 hover:border-[#F59E0B]/60 text-[#FBBF24] hover:bg-[#1F253A] transition-all group shadow-sm shadow-[#F59E0B]/10 active:scale-95"
            aria-label={`Reward balance: ${formatNumber(balance)} coins`}
          >
            <div className="h-5 w-5 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
              <Coins className="h-3.5 w-3.5 text-[#F59E0B] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-xs font-semibold text-[#F3F4F6] font-mono tracking-tight">
              {formatNumber(balance)}
            </span>
            <span className="text-[11px] text-[#F59E0B] font-medium hidden sm:inline">Coins</span>
          </Link>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#1E2538]">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-xs font-bold text-white shadow-inner">
              SP
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-[#F3F4F6]">Saloni</span>
              <span className="text-[10px] text-[#9CA3AF]">Fintech Member</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
