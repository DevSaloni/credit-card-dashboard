from __future__ import annotations

import calendar
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import case, func, select, text
from sqlalchemy.orm import Session

from ..models import Transaction, User


CATEGORY_COLORS: dict[str, str] = {
    "Shopping": "#10B981",
    "Food & Dining": "#F59E0B",
    "Food": "#F59E0B",
    "Travel": "#3B82F6",
    "Health": "#EC4899",
    "Insurance": "#8B5CF6",
    "Bills": "#06B6D4",
    "Bills & Utilities": "#06B6D4",
    "Entertainment": "#F43F5E",
    "Fuel": "#EAB308",
    "Grocery": "#14B8A6",
    "Electronics": "#6366F1",
    "Other": "#64748B",
}


def _decimal_to_float_2(d: Decimal) -> float:
    return float(d.quantize(Decimal("0.01")))


def category_analytics(db: Session) -> list[dict]:
    # Spend only successful payments as "actual spending".
    stmt = (
        select(
            Transaction.category,
            func.sum(Transaction.amount).label("amount"),
            func.count().label("count"),
        )
        .where(Transaction.status == "SUCCESS")
        .group_by(Transaction.category)
    )

    rows = list(db.execute(stmt).all())
    total_spent = sum((row.amount for row in rows if row.amount is not None), start=Decimal("0"))

    items: list[dict] = []
    for row in rows:
        amount: Decimal = row.amount or Decimal("0")
        count: int = int(row.count)
        percentage = (amount / total_spent * Decimal("100")) if total_spent > 0 else Decimal("0")

        # Match the frontend's rounding style (1 decimal place).
        percentage_rounded = percentage.quantize(Decimal("0.1"))

        items.append(
            {
                "category": row.category,
                "amount": _decimal_to_float_2(amount),
                "count": count,
                "percentage": float(percentage_rounded),
                "color": CATEGORY_COLORS.get(row.category, "#64748B"),
            }
        )

    items.sort(key=lambda x: x["amount"], reverse=True)
    return items


def monthly_analytics(db: Session) -> list[dict]:
    month_start = func.date_trunc("month", Transaction.timestamp).label("month_start")

    stmt = (
        select(
            month_start,
            func.sum(case((Transaction.status == "SUCCESS", Transaction.amount), else_=Decimal("0"))).label("success_amount"),
            func.sum(case((Transaction.status == "FAILED", Transaction.amount), else_=Decimal("0"))).label("failed_amount"),
            func.count().label("count"),
        )
        .group_by(month_start)
        .order_by(month_start.asc())
    )

    rows = list(db.execute(stmt).all())

    items: list[dict] = []
    for row in rows:
        ms: datetime = row.month_start
        month_key = ms.strftime("%Y-%m")
        month_label = f"{calendar.month_abbr[ms.month]} {str(ms.year)[-2:]}"

        success_amount: Decimal = row.success_amount or Decimal("0")
        failed_amount: Decimal = row.failed_amount or Decimal("0")
        count: int = int(row.count)

        items.append(
            {
                "monthKey": month_key,
                "monthLabel": month_label,
                "amount": _decimal_to_float_2(success_amount),
                "successAmount": _decimal_to_float_2(success_amount),
                "failedAmount": _decimal_to_float_2(failed_amount),
                "count": count,
            }
        )
    return items


def summary_metrics(db: Session, *, demo_user_id: int = 1) -> dict:
    # Totals: successful transactions only count towards "spending".
    totals_stmt = select(
        func.sum(case((Transaction.status == "SUCCESS", Transaction.amount), else_=Decimal("0"))).label("total_spending"),
        func.count(case((Transaction.status == "SUCCESS", 1))).label("successful_count"),
        func.count(case((Transaction.status == "FAILED", 1))).label("failed_count"),
        func.count().label("total_transactions"),
        func.min(Transaction.timestamp).label("min_ts"),
        func.max(Transaction.timestamp).label("max_ts"),
    )

    row = db.execute(totals_stmt).one()

    total_spending: Decimal = row.total_spending or Decimal("0")
    successful_count = int(row.successful_count or 0)
    failed_count = int(row.failed_count or 0)
    total_transactions = int(row.total_transactions or 0)
    min_ts: datetime | None = row.min_ts
    max_ts: datetime | None = row.max_ts

    reward_coins = (
        db.execute(select(User.coin_balance).where(User.id == demo_user_id)).scalar_one_or_none() or 0
    )

    if min_ts is None:
        start_dt = datetime.now()
        end_dt = datetime.now()
    else:
        start_dt = min_ts
        end_dt = max_ts or min_ts

    # Match the frontend "Month YYYY — Month YYYY" format.
    period_label = f"{start_dt.strftime('%B %Y')} — {end_dt.strftime('%B %Y')}"
    date_range = {"start": start_dt.isoformat(), "end": end_dt.isoformat()}

    return {
        "totalSpending": _decimal_to_float_2(total_spending),
        "successfulCount": successful_count,
        "failedCount": failed_count,
        "totalTransactions": total_transactions,
        "rewardCoins": int(reward_coins),
        "periodLabel": period_label,
        "dateRange": date_range,
    }

