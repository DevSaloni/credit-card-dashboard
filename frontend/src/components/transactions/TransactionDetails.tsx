'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { StatusBadge } from '@/components/ui/Badge';
import { Transaction } from '@/types';
import { formatDate, formatINR, formatTime } from '@/lib/formatters';
import {
  CreditCard,
  Building2,
  Calendar,
  Clock,
  Tag,
  Hash,
  Coins,
  ShieldCheck,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetails({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    if (!transaction?.id) return;
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Coins earned calculation (1 coin per ₹100 spent on success)
  const coinsEarned =
    transaction?.status === 'SUCCESS' && transaction?.amount
      ? Math.floor(transaction.amount / 100)
      : 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      subtitle="Settlement breakdown & ledger audit"
      width="md"
    >
      {transaction ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top Hero Amount Card */}
          <div className="rounded-xl p-5 bg-[#171B2B] border border-[#262F44] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">
              Total Settled Amount
            </div>
            <div className="text-3xl font-extrabold text-[#F9FAFB] font-mono tracking-tight">
              {formatINR(transaction.amount)}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <StatusBadge status={transaction.status} />
              <span className="text-xs text-[#9CA3AF]">
                via {transaction.payment_method}
              </span>
            </div>

            {/* Reward Coin Badge for this transaction */}
            {transaction.status === 'SUCCESS' && coinsEarned > 0 && (
              <div className="mt-4 px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center gap-2 text-xs text-[#FBBF24]">
                <Coins className="h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
                <span>
                  Earned <strong>+{coinsEarned} Spendly Coins</strong> from this payment
                </span>
              </div>
            )}
          </div>

          {/* Detailed Attribute List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
              Transaction Information
            </h4>

            <div className="divide-y divide-[#1D2335] rounded-xl bg-[#121624] border border-[#1E2538] overflow-hidden text-sm">
              {/* Merchant */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Building2 className="h-4 w-4 text-[#10B981]" />
                  <span>Merchant</span>
                </div>
                <span className="font-semibold text-[#F3F4F6]">
                  {transaction.merchant}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Hash className="h-4 w-4 text-[#3B82F6]" />
                  <span>Transaction ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#D1D5DB]">
                    {transaction.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 rounded text-[#6B7280] hover:text-[#F3F4F6] hover:bg-[#1E2538] transition-colors"
                    aria-label="Copy transaction ID"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Tag className="h-4 w-4 text-[#EC4899]" />
                  <span>Category</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1A1F30] border border-[#2B354C] text-[#E5E7EB]">
                  {transaction.category}
                </span>
              </div>

              {/* Currency */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Receipt className="h-4 w-4 text-[#F59E0B]" />
                  <span>Currency</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#F3F4F6]">
                  {transaction.currency} (Indian Rupee)
                </span>
              </div>

              {/* Payment Method */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <CreditCard className="h-4 w-4 text-[#8B5CF6]" />
                  <span>Payment Method</span>
                </div>
                <span className="font-medium text-[#F3F4F6]">
                  {transaction.payment_method}
                </span>
              </div>

              {/* Date */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Calendar className="h-4 w-4 text-[#06B6D4]" />
                  <span>Date</span>
                </div>
                <span className="font-medium text-[#F3F4F6]">
                  {formatDate(transaction.timestamp)}
                </span>
              </div>

              {/* Time */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#9CA3AF]">
                  <Clock className="h-4 w-4 text-[#9CA3AF]" />
                  <span>Time</span>
                </div>
                <span className="font-mono text-xs text-[#F3F4F6]">
                  {formatTime(transaction.timestamp)}
                </span>
              </div>
            </div>
          </div>

          {/* Security / Verification footer */}
          <div className="p-4 rounded-xl bg-[#0F121C] border border-[#1C2234] flex items-center gap-3 text-xs text-[#9CA3AF]">
            <ShieldCheck className="h-5 w-5 text-[#10B981] shrink-0" />
            <span>Verified cryptographic record stored in Spendly settlement ledger.</span>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
          >
            Close Drawer
          </Button>
        </div>
      ) : (
        <div className="py-12 text-center text-[#9CA3AF] text-sm">
          No transaction selected.
        </div>
      )}
    </Drawer>
  );
}
