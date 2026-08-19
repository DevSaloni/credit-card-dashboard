'use client';

import React from 'react';
import { RewardBalance } from '@/components/rewards/RewardBalance';
import { RewardsGrid } from '@/components/rewards/RewardsGrid';
import { useRewards } from '@/context/RewardContext';
import { formatDate } from '@/lib/formatters';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle,
  History,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function RewardsPage() {
  const { history } = useRewards();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Balance Section */}
      <RewardBalance />

      {/* Rewards Catalogue Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#F9FAFB]">
              Available Redemption Vouchers
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Select a partner reward to instantly convert your Spendly coins
            </p>
          </div>
          <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Instant Digital Delivery
          </span>
        </div>

        {/* 5 Vouchers Grid */}
        <RewardsGrid />
      </section>

      {/* Redemptions Ledger / History if any */}
      {history.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="text-base font-bold text-[#F9FAFB]">
              Recent Redemptions
            </h3>
          </div>

          <div className="divide-y divide-[#1D2335] rounded-xl bg-[#111420] border border-[#1E2538] overflow-hidden">
            {history.map((record) => (
              <div
                key={record.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#F3F4F6]">
                      {record.rewardName}
                    </div>
                    <div className="text-[#9CA3AF]">
                      Redeemed on {formatDate(record.redeemedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-[#171B2B] border border-[#262F44] text-[#FBBF24]">
                    Code: {record.code}
                  </div>
                  <div className="font-mono font-bold text-[#F87171]">
                    -{record.coinCost} coins
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it Works / FAQ Section */}
      <section className="pt-6 border-t border-[#1C2234]">
        <h3 className="text-base font-bold text-[#F9FAFB] mb-4 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#3B82F6]" />
          How Spendly Rewards Work
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card elevated className="p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F3F4F6]">
              1. Automatic Coin Accrual
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Every successful credit card bill payment automatically awards 1 coin per ₹100 spent.
            </p>
          </Card>

          <Card elevated className="p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center">
              <Tag className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F3F4F6]">
              2. Guaranteed Partner Deals
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Exchange coins anytime for top brands in food, shopping, entertainment, and travel.
            </p>
          </Card>

          <Card elevated className="p-5 space-y-2">
            <div className="h-8 w-8 rounded-lg bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-semibold text-[#F3F4F6]">
              3. Zero Hidden Charges
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Redemption codes never expire once generated and carry zero redemption fees.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
