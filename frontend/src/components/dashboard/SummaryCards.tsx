'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatINR, formatNumber } from '@/lib/formatters';
import { DashboardMetrics } from '@/types';
import { CreditCard, CheckCircle2, XCircle, Coins, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useRewards } from '@/context/RewardContext';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const { balance } = useRewards();

  const successRate = metrics.totalTransactions > 0
    ? ((metrics.successfulCount / metrics.totalTransactions) * 100).toFixed(1)
    : '0';

  const cards = [
    {
      id: 'total-spending',
      label: 'Total Spending',
      value: formatINR(metrics.totalSpending, false),
      subtext: `Across ${formatNumber(metrics.successfulCount)} successful settlements`,
      icon: CreditCard,
      iconBg: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
      trend: {
        label: 'Healthy Volume',
        icon: TrendingUp,
        color: 'text-[#10B981]',
      },
    },
    {
      id: 'successful-payments',
      label: 'Successful Payments',
      value: formatNumber(metrics.successfulCount),
      subtext: `${successRate}% overall settlement rate`,
      icon: CheckCircle2,
      iconBg: 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30',
      trend: {
        label: 'Verified Complete',
        icon: TrendingUp,
        color: 'text-[#06B6D4]',
      },
    },
    {
      id: 'failed-payments',
      label: 'Failed Payments',
      value: formatNumber(metrics.failedCount),
      subtext: 'Declined by bank or timeout',
      icon: XCircle,
      iconBg: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
      trend: {
        label: 'Action Required',
        icon: null,
        color: 'text-[#F87171]',
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            elevated
            className="p-5 relative overflow-hidden group hover:border-[#2E3A52] transition-all"
          >
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
                {card.label}
              </span>
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center border ${card.iconBg} shadow-xs`}
              >
                <Icon className="h-4.5 w-4.5 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight font-mono">
                {card.value}
              </div>
              <p className="mt-1.5 text-xs text-[#9CA3AF] flex items-center gap-1.5">
                {card.subtext}
              </p>
            </div>
          </Card>
        );
      })}

      {/* Special Reward Coins Card with Gold Identity */}
      <Link href="/rewards" className="block group">
        <div className="h-full rounded-xl p-5 bg-gradient-to-br from-[#1C170E] via-[#1A1610] to-[#121624] border border-[#F59E0B]/35 hover:border-[#F59E0B]/70 shadow-lg shadow-[#F59E0B]/10 hover:shadow-[#F59E0B]/20 transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer">
          {/* Subtle background glow pattern */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#F59E0B]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#F59E0B]/30 transition-all" />

          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#FBBF24] tracking-wide uppercase">
                  Reward Coins
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/30">
                  Active
                </span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24] group-hover:rotate-12 transition-transform shadow-xs">
                <Coins className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FDE68A] tracking-tight font-mono flex items-center gap-1.5">
                <span>🪙</span>
                <span>{formatNumber(balance)}</span>
              </div>
              <p className="mt-1.5 text-xs text-[#D97706] font-medium">
                Earn 1 coin for every ₹100 spent
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F59E0B]/20 flex items-center justify-between text-xs text-[#FBBF24] font-medium group-hover:text-white transition-colors">
            <span>Redeem 5 vouchers</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </div>
  );
}
