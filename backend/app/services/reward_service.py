from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Reward, RewardRedemption, User
from ..errors import http_400, http_404


DEMO_USER_ID_DEFAULT = 1


def get_reward_balance(db: Session, *, user_id: int = DEMO_USER_ID_DEFAULT) -> dict:
    user = db.execute(select(User).where(User.id == user_id)).scalars().first()
    if user is None:
        raise http_404("User not found")
    return {"user_id": user.id, "coin_balance": int(user.coin_balance)}


def list_active_rewards(db: Session) -> list[dict]:
    rewards = db.execute(select(Reward).where(Reward.active.is_(True))).scalars().all()
    items: list[dict] = []
    for r in rewards:
        items.append(
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "coinCost": int(r.coin_cost),
                "category": r.category,
                "value": r.value,
                "partner": r.partner,
                "iconName": r.icon_name,
                "badge": r.badge,
            }
        )
    return items


def redeem_reward(
    db: Session,
    *,
    reward_id: str,
    user_id: int = DEMO_USER_ID_DEFAULT,
) -> dict:
    """
    Redeem a reward atomically with row-level locking.
    """

    # Transaction boundary is handled by FastAPI request scope + explicit begin below.
    with db.begin():
        user = db.execute(select(User).where(User.id == user_id).with_for_update()).scalars().first()
        if user is None:
            raise http_404("User not found")

        reward = db.execute(select(Reward).where(Reward.id == reward_id).with_for_update()).scalars().first()
        if reward is None:
            raise http_404("Reward not found")
        if not reward.active:
            raise http_400("Reward is not active")

        coin_cost = int(reward.coin_cost)
        if int(user.coin_balance) < coin_cost:
            raise http_400("Insufficient coin balance")

        remaining = int(user.coin_balance) - coin_cost
        user.coin_balance = remaining
        user.updated_at = datetime.utcnow()

        redemption = RewardRedemption(
            id=f"RED_{uuid4().hex[:12].upper()}",
            user_id=user.id,
            reward_id=reward.id,
            coins_spent=coin_cost,
            status="SUCCESS",
            created_at=datetime.utcnow(),
            code=f"SPND-{uuid4().hex[:8].upper()}",
        )

        db.add(redemption)

        return {
            "message": "Reward redeemed successfully",
            "reward_id": reward.id,
            "coins_spent": coin_cost,
            "remaining_balance": remaining,
            "redemption": {
                "id": redemption.id,
                "rewardId": redemption.reward_id,
                "rewardName": reward.name,
                "coinCost": coin_cost,
                "redeemedAt": redemption.created_at,
                "code": redemption.code,
            },
        }

