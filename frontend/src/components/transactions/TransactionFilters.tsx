'use client';

import React from 'react';
import { TransactionFilters as FilterType } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, X, RotateCcw, SlidersHorizontal, IndianRupee } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

interface TransactionFiltersProps {
  filters: FilterType;
  categories: string[];
  totalResults: number;
  onFilterChange: (newFilters: Partial<FilterType>) => void;
  onClearAll: () => void;
}

export function TransactionFilters({
  filters,
  categories,
  totalResults,
  onFilterChange,
  onClearAll,
}: TransactionFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    (filters.category && filters.category !== 'ALL') ||
    (filters.status && filters.status !== 'ALL') ||
    typeof filters.minAmount === 'number' ||
    typeof filters.maxAmount === 'number' ||
    filters.startDate ||
    filters.endDate
  );

  return (
    <div className="space-y-4">
      {/* Top Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar (4 cols on lg) */}
        <div className="lg:col-span-4">
          <Input
            placeholder="Search merchants..."
            leftIcon={<Search className="h-4 w-4" />}
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            onClear={() => onFilterChange({ search: '', page: 1 })}
            aria-label="Search merchants"
          />
        </div>

        {/* Category Dropdown (2 cols on lg) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.category || 'ALL'}
            onChange={(val) => onFilterChange({ category: val, page: 1 })}
            aria-label="Filter by Category"
            options={[
              { value: 'ALL', label: 'All Categories' },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />
        </div>

        {/* Status Dropdown (2 cols on lg) */}
        <div className="lg:col-span-2">
          <Select
            value={filters.status || 'ALL'}
            onChange={(val) => onFilterChange({ status: val, page: 1 })}
            aria-label="Filter by Payment Status"
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'SUCCESS', label: 'Paid (Success)' },
              { value: 'FAILED', label: 'Failed' },
            ]}
          />
        </div>

        {/* Min Amount (2 cols on lg) */}
        <div className="lg:col-span-2">
          <Input
            type="number"
            placeholder="Min amount"
            leftIcon={<IndianRupee className="h-3.5 w-3.5" />}
            value={filters.minAmount !== undefined && filters.minAmount !== null ? String(filters.minAmount) : ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : null;
              onFilterChange({ minAmount: val, page: 1 });
            }}
            aria-label="Minimum Amount"
          />
        </div>

        {/* Max Amount (2 cols on lg) */}
        <div className="lg:col-span-2">
          <Input
            type="number"
            placeholder="Max amount"
            leftIcon={<IndianRupee className="h-3.5 w-3.5" />}
            value={filters.maxAmount !== undefined && filters.maxAmount !== null ? String(filters.maxAmount) : ''}
            onChange={(e) => {
              const val = e.target.value ? parseFloat(e.target.value) : null;
              onFilterChange({ maxAmount: val, page: 1 });
            }}
            aria-label="Maximum Amount"
          />
        </div>
      </div>

      {/* Active Filter Chips & Clear Action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[#9CA3AF] flex items-center gap-1 font-medium mr-1">
            <SlidersHorizontal className="h-3 w-3" />
            Active filters:
          </span>

          {/* Search chip */}
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182033] border border-[#2B354C] text-[#E5E7EB]">
              <span>Merchant: &quot;{filters.search}&quot;</span>
              <button
                type="button"
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="hover:text-white"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Category chip */}
          {filters.category && filters.category !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] font-medium">
              <span>Category: {filters.category}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ category: 'ALL', page: 1 })}
                className="hover:text-white"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Status chip */}
          {filters.status && filters.status !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182033] border border-[#2B354C] text-[#E5E7EB]">
              <span>Status: {filters.status === 'SUCCESS' ? 'Paid' : 'Failed'}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ status: 'ALL', page: 1 })}
                className="hover:text-white"
                aria-label="Remove status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Min Amount chip */}
          {typeof filters.minAmount === 'number' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182033] border border-[#2B354C] text-[#E5E7EB]">
              <span>Min: {formatINR(filters.minAmount, false)}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ minAmount: null, page: 1 })}
                className="hover:text-white"
                aria-label="Remove min amount filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Max Amount chip */}
          {typeof filters.maxAmount === 'number' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#182033] border border-[#2B354C] text-[#E5E7EB]">
              <span>Max: {formatINR(filters.maxAmount, false)}</span>
              <button
                type="button"
                onClick={() => onFilterChange({ maxAmount: null, page: 1 })}
                className="hover:text-white"
                aria-label="Remove max amount filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            leftIcon={<RotateCcw className="h-3 w-3" />}
            className="h-7 px-2.5 text-xs text-[#9CA3AF] hover:text-[#EF4444] ml-auto"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
