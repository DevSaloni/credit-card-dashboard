'use client';

import React from 'react';
import { Transaction } from '@/types';
import { formatDate, formatINR } from '@/lib/formatters';
import { StatusBadge } from '@/components/ui/Badge';
import { Eye, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TransactionRowProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
  isSelected?: boolean;
}

export function TransactionRow({
  transaction,
  onView,
  isSelected = false,
}: TransactionRowProps) {
  return (
    <tr
      onClick={() => onView(transaction)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView(transaction);
        }
      }}
      tabIndex={0}
      role="row"
      aria-selected={isSelected}
      className={`group cursor-pointer border-b border-[#1A1F2E] transition-colors outline-none focus-visible:bg-[#1A2030] focus-visible:ring-1 focus-visible:ring-[#10B981] ${
        isSelected
          ? 'bg-[#1A2133]'
          : 'hover:bg-[#141824]'
      }`}
    >
      {/* Date */}
      <td className="py-3.5 px-4 text-xs font-medium text-[#9CA3AF] whitespace-nowrap">
        {formatDate(transaction.timestamp)}
      </td>

      {/* Merchant */}
      <td className="py-3.5 px-4 text-sm font-semibold text-[#F3F4F6] whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span>{transaction.merchant}</span>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#171B2B] text-[#D1D5DB] border border-[#232B3E]">
          {transaction.category}
        </span>
      </td>

      {/* Amount */}
      <td className="py-3.5 px-4 text-sm font-bold font-mono text-[#F9FAFB] whitespace-nowrap text-right">
        {formatINR(transaction.amount)}
      </td>

      {/* Payment Method */}
      <td className="py-3.5 px-4 text-xs text-[#9CA3AF] whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-[#6B7280]" />
          <span>{transaction.payment_method}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4 whitespace-nowrap">
        <StatusBadge status={transaction.status} />
      </td>

      {/* Action */}
      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(transaction)}
          className="h-7 px-2 text-xs text-[#9CA3AF] group-hover:text-[#F3F4F6] group-hover:bg-[#1E2538]"
          aria-label={`View transaction details for ${transaction.merchant}`}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          <span>View</span>
        </Button>
      </td>
    </tr>
  );
}
