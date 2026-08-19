'use client';

import React, { useState } from 'react';
import { Reward, RedemptionRecord } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/formatters';
import { useRewards } from '@/context/RewardContext';
import {
  Coins,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RedeemModalProps {
  reward: Reward | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RedeemModal({ reward, isOpen, onClose }: RedeemModalProps) {
  const { balance, redeem } = useRewards();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<RedemptionRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!reward) return null;

  const currentBalance = balance;
  const coinCost = reward.coinCost;
  const balanceAfter = Math.max(0, currentBalance - coinCost);
  const canAfford = currentBalance >= coinCost;

  const handleConfirm = async () => {
    if (!canAfford) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await redeem(reward.id);
      if (res.success && res.redemption) {
        setRedemptionResult(res.redemption);
      } else {
        setErrorMsg(res.error || 'Redemption failed. Your coins were not deducted.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Your coins were not deducted. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setRedemptionResult(null);
    setErrorMsg(null);
    onClose();
  };

  const handleCopyCode = () => {
    if (redemptionResult?.code) {
      navigator.clipboard.writeText(redemptionResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        redemptionResult
          ? 'Reward Unlocked!'
          : errorMsg
          ? 'Redemption Issue'
          : 'Redeem Reward?'
      }
      description={
        redemptionResult
          ? 'Your coupon code is ready to be applied on partner checkout.'
          : errorMsg
          ? 'We encountered an issue while processing this redemption.'
          : 'Please verify the coin deduction details below.'
      }
    >
      {/* 1. SUCCESS STATE */}
      {redemptionResult ? (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-[#F9FAFB]">
              ✓ Reward redeemed successfully
            </h4>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              {reward.name} from {reward.partner}
            </p>
          </div>

          {/* Voucher Code Card */}
          <div className="p-4 rounded-xl bg-[#171B2B] border border-[#2B354C] flex flex-col items-center justify-center gap-2">
            <span className="text-xs uppercase font-semibold text-[#9CA3AF]">
              Your Voucher Code
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold tracking-widest text-[#FBBF24]">
                {redemptionResult.code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-[#20263A] hover:bg-[#2A334E] text-[#D1D5DB] transition-colors"
                aria-label="Copy voucher code"
              >
                {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            {copied && <span className="text-[10px] text-[#10B981]">Copied to clipboard!</span>}
          </div>

          {/* Balance summary */}
          <div className="rounded-xl bg-[#121624] p-3.5 border border-[#1E2538] flex justify-between items-center text-xs">
            <span className="text-[#9CA3AF]">{formatNumber(coinCost)} coins used</span>
            <span className="font-bold text-[#FDE68A] font-mono">
              Remaining: {formatNumber(balance)} coins
            </span>
          </div>

          <Button variant="primary" className="w-full" onClick={handleModalClose}>
            Done & Return
          </Button>
        </div>
      ) : errorMsg ? (
        /* 2. ERROR STATE */
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center h-16 w-16 mx-auto rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
            <AlertCircle className="h-8 w-8" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-[#F9FAFB]">Redemption failed</h4>
            <p className="mt-1 text-xs text-[#F87171] leading-relaxed">{errorMsg}</p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleConfirm} isLoading={isSubmitting}>
              Try again
            </Button>
          </div>
        </div>
      ) : (
        /* 3. CONFIRMATION STATE */
        <div className="space-y-6">
          {/* Reward overview */}
          <div className="rounded-xl p-4 bg-[#171B2B] border border-[#262F44] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#9CA3AF] uppercase font-semibold">Selected Item</span>
              <div className="font-bold text-[#F9FAFB] text-base">{reward.name}</div>
              <div className="text-xs text-[#9CA3AF]">{reward.partner}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#9CA3AF] uppercase font-semibold">Cost</span>
              <div className="font-mono text-base font-bold text-[#FDE68A] flex items-center gap-1 justify-end">
                <span>🪙</span>
                <span>{formatNumber(coinCost)}</span>
              </div>
            </div>
          </div>

          {/* Balance breakdown table */}
          <div className="divide-y divide-[#1D2335] rounded-xl bg-[#121624] border border-[#1E2538] text-xs">
            <div className="p-3 flex justify-between items-center text-[#9CA3AF]">
              <span>Current balance:</span>
              <span className="font-mono font-semibold text-[#F3F4F6]">
                {formatNumber(currentBalance)} coins
              </span>
            </div>

            <div className="p-3 flex justify-between items-center text-[#9CA3AF]">
              <span>Redemption price:</span>
              <span className="font-mono font-semibold text-[#F87171]">
                - {formatNumber(coinCost)} coins
              </span>
            </div>

            <div className="p-3 flex justify-between items-center font-bold text-[#FDE68A] bg-[#151928]/60">
              <span>Balance after redemption:</span>
              <span className="font-mono text-sm">
                {formatNumber(balanceAfter)} coins
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#F87171] text-xs text-center">
              Not enough coins. You need {formatNumber(coinCost)} coins but currently have {formatNumber(currentBalance)}.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleModalClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={handleConfirm}
              isLoading={isSubmitting}
              disabled={!canAfford || isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Confirm Redemption
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
