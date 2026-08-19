from __future__ import annotations

from datetime import datetime
from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text, TIMESTAMP, Index
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    reward_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("rewards.id", ondelete="CASCADE"),
        nullable=False,
    )

    coins_spent: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False, default="SUCCESS")
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )
    code: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        unique=True,
    )

    __table_args__ = (
        CheckConstraint("coins_spent > 0", name="ck_redemption_coins_spent_positive"),
        CheckConstraint(
            "status IN ('SUCCESS')",
            name="ck_redemption_status_allowed",
        ),
        Index("ix_reward_redemptions_user_id", "user_id"),
        Index("ix_reward_redemptions_reward_id", "reward_id"),
        Index("ix_reward_redemptions_created_at", "created_at"),
    )

