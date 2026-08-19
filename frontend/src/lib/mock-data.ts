import rawTransactionsData from './data/transactions.json';
import {
  Transaction,
  RawTransaction,
  TransactionFilters,
  PaginatedResult,
  DashboardMetrics,
  CategoryAnalyticsItem,
  MonthlySpendingItem,
  Reward,
  RedemptionRecord,
} from '@/types';
import { parseDate } from './formatters';
import { getCategoryColor } from './utils';

// Normalize dataset in memory
export const normalizedTransactions: Transaction[] = (rawTransactionsData as RawTransaction[]).map((raw) => {
  const d = parseDate(raw.timestamp);
  return {
    id: raw.id,
    timestamp: d.toISOString(),
    merchant: raw.merchant || 'Unknown Merchant',
    category: raw.category || 'Other',
    amount: typeof raw.amount === 'number' ? raw.amount : parseFloat(String(raw.amount)) || 0,
    currency: raw.currency || 'INR',
    status: (raw.status ? raw.status.toUpperCase() : 'SUCCESS') as 'SUCCESS' | 'FAILED',
    payment_method: raw.payment_method || 'Credit Card',
  };
});

// Reward catalog
export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew_1',
    name: '₹250 Shopping Voucher',
    description: 'Valid across Amazon, Myntra, and Flipkart on all categories.',
    coinCost: 500,
    category: 'Shopping',
    value: '₹250',
    partner: 'Amazon & Myntra',
    iconName: 'ShoppingBag',
    badge: 'Popular',
  },
  {
    id: 'rew_2',
    name: '₹500 Food Voucher',
    description: 'Instant discount on Swiggy and Zomato orders above ₹299.',
    coinCost: 900,
    category: 'Food',
    value: '₹500',
    partner: 'Swiggy & Zomato',
    iconName: 'Utensils',
    badge: 'Best Value',
  },
  {
    id: 'rew_3',
    name: '₹100 Instant Cashback',
    description: 'Direct credit to your linked primary bank account within 24 hours.',
    coinCost: 300,
    category: 'Cashback',
    value: '₹100',
    partner: 'Spendly Direct',
    iconName: 'Coins',
  },
  {
    id: 'rew_4',
    name: '₹200 Entertainment Voucher',
    description: 'Use on BookMyShow movie tickets, events, or streaming subscriptions.',
    coinCost: 400,
    category: 'Entertainment',
    value: '₹200',
    partner: 'BookMyShow',
    iconName: 'Film',
  },
  {
    id: 'rew_5',
    name: '₹500 Travel Voucher',
    description: 'Flat discount on flights, hotels, and Uber premier bookings.',
    coinCost: 1000,
    category: 'Travel',
    value: '₹500',
    partner: 'MakeMyTrip & Uber',
    iconName: 'Plane',
    badge: 'Premium',
  },
];

// Initial reward coin balance
export let mockCoinBalance = 2450;
export const mockRedemptions: RedemptionRecord[] = [];

export function setMockBalance(newBalance: number) {
  mockCoinBalance = newBalance;
}

// Available unique categories
export const UNIQUE_CATEGORIES = Array.from(
  new Set(normalizedTransactions.map((t) => t.category))
).sort();

// Calculate total metrics once or dynamically
export function calculateDashboardMetrics(): DashboardMetrics {
  let totalSpending = 0;
  let successfulCount = 0;
  let failedCount = 0;
  let minDateMs = Infinity;
  let maxDateMs = -Infinity;

  for (const txn of normalizedTransactions) {
    const timeMs = new Date(txn.timestamp).getTime();
    if (timeMs < minDateMs) minDateMs = timeMs;
    if (timeMs > maxDateMs) maxDateMs = timeMs;

    if (txn.status === 'SUCCESS') {
      totalSpending += txn.amount;
      successfulCount++;
    } else if (txn.status === 'FAILED') {
      failedCount++;
    }
  }

  const startDate = minDateMs !== Infinity ? new Date(minDateMs) : new Date();
  const endDate = maxDateMs !== -Infinity ? new Date(maxDateMs) : new Date();

  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const periodLabel = `${startFormatted} — ${endFormatted}`;

  return {
    totalSpending,
    successfulCount,
    failedCount,
    totalTransactions: normalizedTransactions.length,
    rewardCoins: mockCoinBalance,
    periodLabel,
    dateRange: {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    },
  };
}

// Category breakdown analytics
export function calculateCategoryAnalytics(): CategoryAnalyticsItem[] {
  const map = new Map<string, { amount: number; count: number }>();
  let totalSpent = 0;

  for (const txn of normalizedTransactions) {
    if (txn.status !== 'SUCCESS') continue;
    const cat = txn.category || 'Other';
    const curr = map.get(cat) || { amount: 0, count: 0 };
    curr.amount += txn.amount;
    curr.count += 1;
    map.set(cat, curr);
    totalSpent += txn.amount;
  }

  const items: CategoryAnalyticsItem[] = [];
  for (const [cat, data] of map.entries()) {
    const percentage = totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0;
    items.push({
      category: cat,
      amount: Math.round(data.amount * 100) / 100,
      count: data.count,
      percentage: Math.round(percentage * 10) / 10,
      color: getCategoryColor(cat),
    });
  }

  return items.sort((a, b) => b.amount - a.amount);
}

// Monthly spending breakdown
export function calculateMonthlySpending(): MonthlySpendingItem[] {
  const map = new Map<string, { totalAmount: number; successAmount: number; failedAmount: number; count: number }>();

  for (const txn of normalizedTransactions) {
    const d = new Date(txn.timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    const curr = map.get(monthKey) || { totalAmount: 0, successAmount: 0, failedAmount: 0, count: 0 };
    curr.count += 1;
    curr.totalAmount += txn.amount;

    if (txn.status === 'SUCCESS') {
      curr.successAmount += txn.amount;
    } else {
      curr.failedAmount += txn.amount;
    }

    map.set(monthKey, curr);
  }

  const sortedKeys = Array.from(map.keys()).sort();

  return sortedKeys.map((key) => {
    const data = map.get(key)!;
    const [year, month] = key.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, 1);
    const monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

    return {
      monthKey: key,
      monthLabel,
      amount: Math.round(data.successAmount * 100) / 100,
      successAmount: Math.round(data.successAmount * 100) / 100,
      failedAmount: Math.round(data.failedAmount * 100) / 100,
      count: data.count,
    };
  });
}

// Query transactions with filters, search, sort, and pagination
export function queryTransactions(filters: TransactionFilters = {}): PaginatedResult<Transaction> {
  const {
    search,
    category,
    status,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortBy = 'date_desc',
    page = 1,
    pageSize = 25,
  } = filters;

  const searchLower = search ? search.trim().toLowerCase() : '';
  const startMs = startDate ? new Date(startDate).getTime() : null;
  const endMs = endDate ? new Date(endDate).getTime() : null;

  // Filter pass
  const filtered = normalizedTransactions.filter((txn) => {
    // Search merchant name
    if (searchLower && !txn.merchant.toLowerCase().includes(searchLower)) {
      return false;
    }

    // Category
    if (category && category !== 'ALL' && txn.category !== category) {
      return false;
    }

    // Status
    if (status && status !== 'ALL' && txn.status !== status) {
      return false;
    }

    // Amount range
    if (typeof minAmount === 'number' && txn.amount < minAmount) {
      return false;
    }
    if (typeof maxAmount === 'number' && txn.amount > maxAmount) {
      return false;
    }

    // Date range
    const txnMs = new Date(txn.timestamp).getTime();
    if (startMs && txnMs < startMs) {
      return false;
    }
    if (endMs && txnMs > endMs) {
      return false;
    }

    return true;
  });

  // Sort pass
  filtered.sort((a, b) => {
    if (sortBy === 'date_desc') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    if (sortBy === 'date_asc') {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    if (sortBy === 'amount_desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount_asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedData,
    total,
    page: validPage,
    pageSize,
    totalPages,
  };
}
