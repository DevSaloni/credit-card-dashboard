/**
 * Frontend API Service Layer
 *
 * Connects to the FastAPI backend at /api/... endpoints.
 * When the backend is unavailable, falls back to local mock data
 * for development convenience.
 */

import {
  Transaction,
  TransactionFilters,
  PaginatedResult,
  DashboardMetrics,
  CategoryAnalyticsItem,
  MonthlySpendingItem,
  Reward,
  RedemptionRecord,
} from '@/types';

// ── Backend base URL (configurable via env) ──────────────────────────
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── Transactions ─────────────────────────────────────────────────────

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<PaginatedResult<Transaction>> {
  const params = new URLSearchParams();

  params.set('page', String(filters.page || 1));
  params.set('page_size', String(filters.pageSize || 25));

  if (filters.search) params.set('search', filters.search);
  if (filters.category && filters.category !== 'ALL')
    params.set('category', filters.category);
  if (filters.status && filters.status !== 'ALL')
    params.set('status', filters.status);
  if (filters.startDate) params.set('start_date', filters.startDate);
  if (filters.endDate) params.set('end_date', filters.endDate);
  if (filters.minAmount !== undefined && filters.minAmount !== null)
    params.set('min_amount', String(filters.minAmount));
  if (filters.maxAmount !== undefined && filters.maxAmount !== null)
    params.set('max_amount', String(filters.maxAmount));

  // Map frontend sort to backend sort_by
  const sortMap: Record<string, string> = {
    date_desc: 'date_desc',
    date_asc: 'date_asc',
    amount_desc: 'amount_desc',
    amount_asc: 'amount_asc',
  };
  if (filters.sortBy && sortMap[filters.sortBy]) {
    params.set('sort_by', sortMap[filters.sortBy]);
  }

  const data = await apiFetch<{
    items: Array<{
      id: string;
      timestamp: string;
      merchant: string;
      category: string;
      amount: number;
      currency: string;
      status: string;
      payment_method: string;
    }>;
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  }>(`/transactions?${params.toString()}`);

  // Normalize backend snake_case → frontend camelCase
  const items: Transaction[] = data.items.map((t) => ({
    id: t.id,
    timestamp: t.timestamp,
    merchant: t.merchant,
    category: t.category,
    amount: t.amount,
    currency: t.currency,
    status: t.status as Transaction['status'],
    payment_method: t.payment_method,
  }));

  return {
    data: items,
    page: data.page,
    pageSize: data.page_size,
    total: data.total,
    totalPages: data.total_pages,
  };
}

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  try {
    const t = await apiFetch<{
      id: string;
      timestamp: string;
      merchant: string;
      category: string;
      amount: number;
      currency: string;
      status: string;
      payment_method: string;
    }>(`/transactions/${id}`);

    return {
      id: t.id,
      timestamp: t.timestamp,
      merchant: t.merchant,
      category: t.category,
      amount: t.amount,
      currency: t.currency,
      status: t.status as Transaction['status'],
      payment_method: t.payment_method,
    };
  } catch {
    return null;
  }
}

// ── Analytics ────────────────────────────────────────────────────────

export async function getSummaryMetrics(): Promise<DashboardMetrics> {
  const data = await apiFetch<{
    totalSpending: number;
    successfulCount: number;
    failedCount: number;
    totalTransactions: number;
    rewardCoins: number;
    periodLabel: string;
    dateRange: { start: string; end: string };
  }>('/analytics/summary');

  return {
    totalSpending: data.totalSpending,
    successfulCount: data.successfulCount,
    failedCount: data.failedCount,
    totalTransactions: data.totalTransactions,
    rewardCoins: data.rewardCoins,
    periodLabel: data.periodLabel,
    dateRange: data.dateRange,
  };
}

export async function getCategoryAnalytics(): Promise<CategoryAnalyticsItem[]> {
  return apiFetch<CategoryAnalyticsItem[]>('/analytics/category');
}

export async function getMonthlyAnalytics(): Promise<MonthlySpendingItem[]> {
  return apiFetch<MonthlySpendingItem[]>('/analytics/monthly');
}

// ── Rewards ──────────────────────────────────────────────────────────

export async function getRewards(): Promise<Reward[]> {
  const data = await apiFetch<
    Array<{
      id: string;
      name: string;
      description: string;
      coinCost: number;
      category: string;
      value: string;
      partner: string;
      iconName: string;
      badge: string | null;
    }>
  >('/rewards');

  return data.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    coinCost: r.coinCost,
    category: r.category,
    value: r.value,
    partner: r.partner,
    iconName: r.iconName,
    badge: r.badge || undefined,
  }));
}

export async function getBalance(): Promise<number> {
  const data = await apiFetch<{ user_id: number; coin_balance: number }>(
    '/rewards/balance'
  );
  return data.coin_balance;
}

export async function redeemReward(
  rewardId: string
): Promise<{
  success: boolean;
  newBalance: number;
  redemption?: RedemptionRecord;
  error?: string;
}> {
  try {
    const data = await apiFetch<{
      message: string;
      reward_id: string;
      coins_spent: number;
      remaining_balance: number;
      redemption: {
        id: string;
        rewardId: string;
        rewardName: string;
        coinCost: number;
        redeemedAt: string;
        code: string;
      };
    }>(`/rewards/${rewardId}/redeem`, { method: 'POST' });

    return {
      success: true,
      newBalance: data.remaining_balance,
      redemption: {
        id: data.redemption.id,
        rewardId: data.redemption.rewardId,
        rewardName: data.redemption.rewardName,
        coinCost: data.redemption.coinCost,
        redeemedAt: data.redemption.redeemedAt,
        code: data.redemption.code,
      },
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Redemption failed unexpectedly.';
    // Fetch the current balance to ensure UI stays consistent
    let currentBalance = 0;
    try {
      currentBalance = await getBalance();
    } catch {
      // If balance fetch also fails, we can't recover
    }
    return {
      success: false,
      newBalance: currentBalance,
      error: message,
    };
  }
}

// ── Categories ───────────────────────────────────────────────────────

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>('/transactions/categories');
}
