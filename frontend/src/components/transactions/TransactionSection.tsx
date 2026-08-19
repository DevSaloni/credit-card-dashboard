'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionFilters as FilterType, PaginatedResult } from '@/types';
import { getTransactions } from '@/lib/api';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { Pagination } from './Pagination';
import { TransactionDetails } from './TransactionDetails';
import { ErrorState } from '@/components/ui/ErrorState';
import { ArrowLeftRight } from 'lucide-react';

interface TransactionSectionProps {
  categories: string[];
  externalCategoryFilter?: string;
  onClearExternalCategory?: () => void;
}

export function TransactionSection({
  categories,
  externalCategoryFilter,
  onClearExternalCategory,
}: TransactionSectionProps) {
  // State
  const [filters, setFilters] = useState<FilterType>({
    category: externalCategoryFilter || 'ALL',
    status: 'ALL',
    search: '',
    minAmount: null,
    maxAmount: null,
    sortBy: 'date_desc',
    page: 1,
    pageSize: 25,
  });

  const [result, setResult] = useState<PaginatedResult<Transaction>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Sync external category filter from chart click
  useEffect(() => {
    if (externalCategoryFilter !== undefined) {
      setFilters((prev) => ({
        ...prev,
        category: externalCategoryFilter,
        page: 1,
      }));
    }
  }, [externalCategoryFilter]);

  // Load transactions whenever filters/sort/page changes
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await getTransactions(filters);
      setResult(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  };

  const handleClearAll = () => {
    setFilters({
      category: 'ALL',
      status: 'ALL',
      search: '',
      minAmount: null,
      maxAmount: null,
      sortBy: 'date_desc',
      page: 1,
      pageSize: 25,
    });
    if (onClearExternalCategory) {
      onClearExternalCategory();
    }
  };

  const handleSortChange = (newSort: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: newSort,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setIsDrawerOpen(true);
  };

  return (
    <section id="transactions-section" className="space-y-4 pt-4 scroll-mt-20">
      {/* Header title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <ArrowLeftRight className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#F9FAFB]">
              Transactions Ledger
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              All card settlements, merchant records & payment verifications
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilters
        filters={filters}
        categories={categories}
        totalResults={result.total}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
      />

      {/* Table / Error Container */}
      {hasError ? (
        <div className="rounded-xl border border-[#EF4444]/20 bg-[#111420]">
          <ErrorState
            title="Unable to load transactions"
            message="There was an error communicating with the transaction service."
            onRetry={loadTransactions}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <TransactionTable
            transactions={result.data}
            isLoading={isLoading}
            selectedTransactionId={selectedTransaction?.id}
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
            onViewTransaction={handleViewTransaction}
            onClearFilters={handleClearAll}
          />

          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            totalItems={result.total}
            pageSize={result.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Transaction Details Drawer */}
      <TransactionDetails
        transaction={selectedTransaction}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </section>
  );
}
