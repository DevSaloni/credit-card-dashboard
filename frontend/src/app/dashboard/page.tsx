'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SpendingByCategory } from '@/components/dashboard/SpendingByCategory';
import { MonthlySpending } from '@/components/dashboard/MonthlySpending';
import { TransactionSection } from '@/components/transactions/TransactionSection';
import {
  getSummaryMetrics,
  getCategoryAnalytics,
  getMonthlyAnalytics,
  getCategories,
} from '@/lib/api';
import {
  DashboardMetrics,
  CategoryAnalyticsItem,
  MonthlySpendingItem,
} from '@/types';
import { MetricCardSkeleton, ChartSkeleton } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryAnalyticsItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySpendingItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setHasError(false);

    try {
      const [m, catData, mData, cList] = await Promise.all([
        getSummaryMetrics(),
        getCategoryAnalytics(),
        getMonthlyAnalytics(),
        getCategories(),
      ]);

      setMetrics(m);
      setCategoriesData(catData);
      setMonthlyData(mData);
      setCategoriesList(cList);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategorySelect = (category: string | undefined) => {
    setSelectedCategory(category);
    // Smooth scroll down to transactions table if category selected
    if (category) {
      const el = document.getElementById('transactions-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (hasError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Unable to load dashboard metrics"
          message="We ran into an issue retrieving your spending analytics."
          onRetry={() => loadData(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <DashboardHeader
        periodLabel={metrics?.periodLabel || 'October 2025 — August 2026'}
        onRefresh={() => loadData(true)}
        isRefreshing={isRefreshing}
      />

      {/* 4 Summary Metric Cards */}
      {isLoading || !metrics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <SummaryCards metrics={metrics} />
      )}

      {/* Spending Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5">
          {isLoading ? (
            <ChartSkeleton height={420} />
          ) : (
            <SpendingByCategory
              data={categoriesData}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          )}
        </div>

        {/* Monthly Spending Trend Chart (7 cols) */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <ChartSkeleton height={420} />
          ) : (
            <MonthlySpending data={monthlyData} />
          )}
        </div>
      </div>

      {/* Transactions Table & Ledger Section */}
      <TransactionSection
        categories={categoriesList}
        externalCategoryFilter={selectedCategory}
        onClearExternalCategory={() => setSelectedCategory(undefined)}
      />
    </div>
  );
}
