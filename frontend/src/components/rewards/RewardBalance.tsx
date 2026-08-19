'use client';

import React from 'react';
import { useRewards } from '@/context/RewardContext';
import { formatNumber } from '@/lib/formatters';
import { Coins, Sparkles, ShieldAlert, Gift } from 'lucide-react';

export function RewardBalance() {
  const { balance } = useRewards();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C170E] via-[#16141F] to-[#0D101A] border border-[#F59E0B]/30 p-6 sm:p-8 shadow-xl shadow-black/50">
      {/* Glow highlight */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F59E0B]/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-[#10B981]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#FBBF24] text-xs font-bold uppercase tracking-wider mb-3">
            <Gift className="h-3.5 w-3.5" />
            <span>Spendly Rewards Club</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F9FAFB]">
            Turn payments into rewards.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#9CA3AF] max-w-xl leading-relaxed">
            Every successful card settlement earns you spendable coins. Redeem instantly for verified merchant vouchers & cashback.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#FBBF24]">
            <Sparkles className="h-4 w-4" />
            <span>Rule: Earn 1 coin for every ₹100 spent on successful payments.</span>
          </div>
        </div>

        {/* Balance Display Card */}
        <div className="shrink-0 flex flex-col items-start md:items-end justify-center bg-[#111420]/80 border border-[#F59E0B]/30 rounded-xl p-5 backdrop-blur-md shadow-inner">
          <div className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
            Available Reward Balance
          </div>
          <div className="flex items-center gap-2.5 text-3xl sm:text-4xl font-black font-mono text-[#FDE68A]">
            <div className="h-9 w-9 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <span>{formatNumber(balance)}</span>
          </div>
          <span className="text-xs font-semibold text-[#D97706] mt-1">
            Spendly Coins Ready to Redeem
          </span>
        </div>
      </div>
    </div>
  );
}
