from __future__ import annotations

from decimal import Decimal
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..errors import http_404
from ..models import Transaction
from ..schemas.transaction import PaginatedTransactions, TransactionOut
from ..services.transaction_service import list_categories, list_transactions, get_transaction_by_id

SortBy = Literal["date_desc", "date_asc", "amount_desc", "amount_asc", "timestamp", "amount"]
SortOrder = Literal["asc", "desc"]
StatusFilter = Literal["SUCCESS", "FAILED", "ALL"]

router = APIRouter(prefix="/api")


def _to_out(txn: Transaction) -> TransactionOut:
    return TransactionOut(
        id=txn.id,
        timestamp=txn.timestamp,
        merchant=txn.merchant,
        category=txn.category,
        amount=float(txn.amount.quantize(Decimal("0.01"))) if hasattr(txn.amount, "quantize") else float(txn.amount),
        currency=txn.currency,
        status=txn.status,
        payment_method=txn.payment_method,
    )


@router.get("/transactions", response_model=PaginatedTransactions, summary="List transactions with filters")
def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    search: str | None = Query(None, min_length=1, max_length=200, description="Merchant search (substring match)"),
    category: str | None = Query(None, description="Exact category filter"),
    status: StatusFilter | None = Query("ALL", description="Payment status filter"),
    start_date: str | None = Query(None, description="YYYY-MM-DD (UTC) start date"),
    end_date: str | None = Query(None, description="YYYY-MM-DD (UTC) end date"),
    min_amount: Decimal | None = Query(None, ge=0),
    max_amount: Decimal | None = Query(None, ge=0),
    sort_by: SortBy = Query("date_desc"),
    sort_order: SortOrder = Query("desc"),
    db: Session = Depends(get_db),
):
    # Parse date params as date objects (FastAPI would do this automatically if we used date typing;
    # we keep strings to accept both optionality + clear error messages).
    import datetime

    start_date_obj = None
    end_date_obj = None
    if start_date:
        start_date_obj = datetime.date.fromisoformat(start_date)
    if end_date:
        end_date_obj = datetime.date.fromisoformat(end_date)

    items, total = list_transactions(
        db,
        page=page,
        page_size=page_size,
        search=search,
        category=category,
        status=status,
        start_date=start_date_obj,
        end_date=end_date_obj,
        min_amount=min_amount,
        max_amount=max_amount,
        sort_by=sort_by,
        sort_order=sort_order,
    )

    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    return PaginatedTransactions(
        items=[_to_out(t) for t in items],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )


@router.get("/transactions/categories", response_model=list[str], summary="List available categories")
def get_categories(db: Session = Depends(get_db)):
    return list_categories(db)


@router.get("/transactions/{transaction_id}", response_model=TransactionOut, summary="Transaction details")
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    txn = get_transaction_by_id(db, transaction_id)
    if txn is None:
        raise http_404("Transaction not found")
    return _to_out(txn)

