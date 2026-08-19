from __future__ import annotations

from datetime import date, datetime, time, timezone
from decimal import Decimal

from sqlalchemy import and_, func, literal, or_, select
from sqlalchemy.orm import Session

from ..models import Transaction


_STATUS_ALLOWED = {"SUCCESS", "FAILED"}
_STATUS_ALL = {"ALL", None}


def _parse_start_end_dt(start_date: date | None, end_date: date | None) -> tuple[datetime | None, datetime | None]:
    """
    Convert YYYY-MM-DD dates into UTC datetimes so date-range filtering is deterministic.
    """

    start_dt = None
    end_dt = None

    if start_date:
        start_dt = datetime.combine(start_date, time.min).replace(tzinfo=timezone.utc)
    if end_date:
        # Treat end_date as inclusive
        end_dt = datetime.combine(end_date, time.max).replace(tzinfo=timezone.utc)
    return start_dt, end_dt


def list_transactions(
    db: Session,
    *,
    page: int,
    page_size: int,
    search: str | None,
    category: str | None,
    status: str | None,
    start_date: date | None,
    end_date: date | None,
    min_amount: Decimal | None,
    max_amount: Decimal | None,
    sort_by: str,
    sort_order: str = "desc",
) -> tuple[list[Transaction], int]:
    start_dt, end_dt = _parse_start_end_dt(start_date, end_date)

    conditions = []

    if search:
        conditions.append(Transaction.merchant.ilike(f"%{search.strip()}%"))

    if category and category != "ALL":
        conditions.append(Transaction.category == category)

    if status and status != "ALL":
        if status not in _STATUS_ALLOWED:
            # Fail fast: caller should validate, but keep it robust.
            raise ValueError("Invalid status filter")
        conditions.append(Transaction.status == status)

    if start_dt:
        conditions.append(Transaction.timestamp >= start_dt)
    if end_dt:
        conditions.append(Transaction.timestamp <= end_dt)

    if min_amount is not None:
        conditions.append(Transaction.amount >= min_amount)
    if max_amount is not None:
        conditions.append(Transaction.amount <= max_amount)

    where_clause = and_(*conditions) if conditions else literal(True)

    count_stmt = select(func.count()).select_from(Transaction).where(where_clause)
    total = db.execute(count_stmt).scalar_one()

    # Sorting
    sort_order_norm = sort_order.lower()
    if sort_order_norm not in {"asc", "desc"}:
        raise ValueError("Invalid sort_order")

    order_dir = Transaction.timestamp.asc() if sort_order_norm == "asc" else Transaction.timestamp.desc()

    if sort_by in {"timestamp", "date_desc", "date_asc"}:
        if sort_by == "date_desc":
            order_dir = Transaction.timestamp.desc()
        elif sort_by == "date_asc":
            order_dir = Transaction.timestamp.asc()
        else:
            order_dir = Transaction.timestamp.asc() if sort_order_norm == "asc" else Transaction.timestamp.desc()
    elif sort_by in {"amount", "amount_desc", "amount_asc"}:
        if sort_by == "amount_desc":
            order_dir = Transaction.amount.desc()
        elif sort_by == "amount_asc":
            order_dir = Transaction.amount.asc()
        else:
            order_dir = Transaction.amount.asc() if sort_order_norm == "asc" else Transaction.amount.desc()
    else:
        raise ValueError("Invalid sort_by")

    items_stmt = (
        select(Transaction)
        .where(where_clause)
        .order_by(order_dir)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    items = list(db.execute(items_stmt).scalars().all())
    return items, int(total)


def get_transaction_by_id(db: Session, transaction_id: str) -> Transaction | None:
    stmt = select(Transaction).where(Transaction.id == transaction_id)
    return db.execute(stmt).scalars().first()


def list_categories(db: Session) -> list[str]:
    stmt = select(Transaction.category).distinct().order_by(Transaction.category.asc())
    return [row[0] for row in db.execute(stmt).all()]

