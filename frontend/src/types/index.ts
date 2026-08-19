export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Netbanking' | string;

export interface RawTransaction {
  id: string;
  timestamp: string | number;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus | string;
  payment_method: PaymentMethod;
}

export interface Transaction {
  id: string;
  timestamp: string; // Normalized ISO string
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: PaymentMethod;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number | null;
  maxAmount?: number | null;
  sortBy?: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalSpending: number;
  successfulCount: number;
  failedCount: number;
  totalTransactions: number;
  rewardCoins: number;
  periodLabel: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CategoryAnalyticsItem {
  category: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface MonthlySpendingItem {
  monthKey: string; // e.g. "2025-10"
  monthLabel: string; // e.g. "Oct 2025"
  amount: number;
  successAmount: number;
  failedAmount: number;
  count: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  category: 'Shopping' | 'Food' | 'Cashback' | 'Entertainment' | 'Travel' | string;
  value: string;
  partner: string;
  iconName: string;
  badge?: string;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardName: string;
  coinCost: number;
  redeemedAt: string;
  code: string;
}
