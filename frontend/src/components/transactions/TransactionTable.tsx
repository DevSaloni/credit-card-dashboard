'use client';

import React from 'react';
import { Transaction } from '@/types';
import { TransactionRow } from './TransactionRow';
import { TableSkeletonRows } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  selectedTransactionId?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  onSortChange: (newSort: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc') => void;
  onViewTransaction: (transaction: Transaction) => void;
  onClearFilters?: () => void;
}

export function TransactionTable({
  transactions,
  isLoading = false,
  selectedTransactionId,
  sortBy = 'date_desc',
  onSortChange,
  onViewTransaction,
  onClearFilters,
}: TransactionTableProps) {
  // Sort helpers
  const handleDateSort = () => {
    onSortChange(sortBy === 'date_desc' ? 'date_asc' : 'date_desc');
  };

  const handleAmountSort = () => {
    onSortChange(sortBy === 'amount_desc' ? 'amount_asc' : 'amount_desc');
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1F2637] bg-[#111420] shadow-sm">
      <table className="w-full text-left border-collapse spendly-table">
        {/* Sticky Header */}
        <thead>
          <tr className="border-b border-[#20273B] bg-[#141826] text-[#9CA3AF]">
            {/* Date with sort */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap">
              <button
                type="button"
                onClick={handleDateSort}
                className="flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded px-1 -ml-1 cursor-pointer"
                aria-label="Sort by Date"
              >
                <span>Date</span>
                {sortBy === 'date_desc' ? (
                  <ArrowDown className="h-3.5 w-3.5 text-[#10B981]" />
                ) : sortBy === 'date_asc' ? (
                  <ArrowUp className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 text-[#6B7280]" />
                )}
              </button>
            </th>

            {/* Merchant */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap">
              Merchant
            </th>

            {/* Category */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap">
              Category
            </th>

            {/* Amount with sort */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap text-right">
              <button
                type="button"
                onClick={handleAmountSort}
                className="inline-flex items-center gap-1.5 hover:text-[#F3F4F6] transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded px-1 -mr-1 cursor-pointer ml-auto"
                aria-label="Sort by Amount"
              >
                <span>Amount</span>
                {sortBy === 'amount_desc' ? (
                  <ArrowDown className="h-3.5 w-3.5 text-[#10B981]" />
                ) : sortBy === 'amount_asc' ? (
                  <ArrowUp className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 text-[#6B7280]" />
                )}
              </button>
            </th>

            {/* Payment Method */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap">
              Payment Method
            </th>

            {/* Status */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap">
              Status
            </th>

            {/* Action */}
            <th scope="col" className="py-3.5 px-4 font-semibold text-xs whitespace-nowrap text-right">
              Action
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {isLoading ? (
            <TableSkeletonRows rowCount={8} />
          ) : transactions.length > 0 ? (
            transactions.map((txn) => (
              <TransactionRow
                key={txn.id}
                transaction={txn}
                onView={onViewTransaction}
                isSelected={selectedTransactionId === txn.id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-0">
                <EmptyState
                  title="No transactions found"
                  description="Try adjusting your filters, amount range, or clearing active search terms."
                  actionLabel="Clear all filters"
                  onAction={onClearFilters}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
