'use client';

import React from 'react';
import { Reward } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/formatters';
import {
  ShoppingBag,
  Utensils,
  Coins,
  Film,
  Plane,
  Gift,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  userBalance: number;
  onSelectRedeem: (reward: Reward) => void;
}

export function RewardCard({
  reward,
  userBalance,
  onSelectRedeem,
}: RewardCardProps) {
  const canAfford = userBalance >= reward.coinCost;
  const coinsNeeded = reward.coinCost - userBalance;

  // Icon map
  const getIcon = () => {
    switch (reward.iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="h-6 w-6 text-[#10B981]" />;
      case 'Utensils':
        return <Utensils className="h-6 w-6 text-[#F59E0B]" />;
      case 'Coins':
        return <Coins className="h-6 w-6 text-[#FBBF24]" />;
      case 'Film':
        return <Film className="h-6 w-6 text-[#F43F5E]" />;
      case 'Plane':
        return <Plane className="h-6 w-6 text-[#3B82F6]" />;
      default:
        return <Gift className="h-6 w-6 text-[#10B981]" />;
    }
  };

  return (
    <Card
      elevated
      className={`flex flex-col justify-between p-6 transition-all duration-200 relative overflow-hidden ${
        canAfford
          ? 'hover:border-[#F59E0B]/50 hover:bg-[#141826]'
          : 'opacity-85 border-[#1A1F2E]'
      }`}
    >
      {/* Optional Badge */}
      {reward.badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 uppercase tracking-wider">
          {reward.badge}
        </span>
      )}

      <div>
        {/* Icon & Category */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-[#171C2B] border border-[#242C40] flex items-center justify-center shadow-xs">
            {getIcon()}
          </div>
          <div>
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              {reward.category} • {reward.partner}
            </span>
            <h3 className="text-lg font-bold text-[#F9FAFB] leading-snug">
              {reward.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
          {reward.description}
        </p>
      </div>

      {/* Footer Area */}
      <div className="pt-4 border-t border-[#1C2234] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">Redemption Cost</span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-[#FDE68A]">
            <span>🪙</span>
            <span>{formatNumber(reward.coinCost)}</span>
            <span className="text-[11px] text-[#9CA3AF] font-normal font-sans">coins</span>
          </div>
        </div>

        {canAfford ? (
          <Button
            variant="gold"
            className="w-full"
            onClick={() => onSelectRedeem(reward)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Redeem Voucher
          </Button>
        ) : (
          <div className="space-y-1.5">
            <Button
              variant="secondary"
              disabled
              className="w-full text-xs text-[#6B7280]"
              leftIcon={<Lock className="h-3.5 w-3.5" />}
            >
              Not enough coins
            </Button>
            <p className="text-[11px] text-center text-[#F87171]">
              You need {formatNumber(coinsNeeded)} more coins
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
