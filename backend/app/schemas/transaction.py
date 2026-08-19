from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, Field


class TransactionOut(BaseModel):
    id: str
    timestamp: datetime
    merchant: str
    category: str
    amount: float
    currency: str
    status: str
    payment_method: str


class PaginatedTransactions(BaseModel):
    items: list[TransactionOut]
    page: int
    page_size: int
    total: int
    total_pages: int

