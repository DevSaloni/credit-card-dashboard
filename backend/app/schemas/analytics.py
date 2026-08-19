from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class CategoryAnalyticsItemOut(BaseModel):
    category: str
    amount: float
    count: int
    percentage: float
    color: str


class MonthlySpendingItemOut(BaseModel):
    monthKey: str
    monthLabel: str
    amount: float
    successAmount: float
    failedAmount: float
    count: int


class SummaryMetricsOut(BaseModel):
    totalSpending: float
    successfulCount: int
    failedCount: int
    totalTransactions: int
    rewardCoins: int
    periodLabel: str
    dateRange: dict[str, str]

