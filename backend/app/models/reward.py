from __future__ import annotations

from datetime import datetime
from sqlalchemy import Boolean, CheckConstraint, Integer, String, Text, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class Reward(Base):
    __tablename__ = "rewards"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # e.g. "rew_1"
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    coin_cost: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Extra catalogue fields used by the existing frontend UI.
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(String(100), nullable=False)
    partner: Mapped[str] = mapped_column(String(200), nullable=False)
    icon_name: Mapped[str] = mapped_column(String(100), nullable=False)
    badge: Mapped[str | None] = mapped_column(String(100), nullable=True)

    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    __table_args__ = (
        CheckConstraint("coin_cost > 0", name="ck_rewards_coin_cost_positive"),
    )

