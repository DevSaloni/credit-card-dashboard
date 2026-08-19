from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import CheckConstraint, String, Text, Numeric, Index, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    timestamp: Mapped[datetime] = mapped_column(  # TIMESTAMPTZ
        TIMESTAMP(timezone=True),
        index=True,
        nullable=False,
    )
    merchant: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="INR")
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    payment_method: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(  # TIMESTAMPTZ
        TIMESTAMP(timezone=True),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_transactions_amount_non_negative"),
        CheckConstraint(
            "status IN ('SUCCESS','FAILED')",
            name="ck_transactions_status_allowed",
        ),
        Index("ix_transactions_merchant", "merchant"),
        Index("ix_transactions_category", "category"),
        Index("ix_transactions_status", "status"),
        Index("ix_transactions_amount", "amount"),
    )

