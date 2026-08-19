from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..schemas.reward import RedeemRewardSuccessOut, RewardBalanceOut, RewardOut
from ..services.reward_service import get_reward_balance, list_active_rewards, redeem_reward

router = APIRouter(prefix="/api/rewards")


@router.get("/balance", response_model=RewardBalanceOut, summary="Get reward coin balance")
def rewards_balance(db: Session = Depends(get_db)) -> RewardBalanceOut:
    return get_reward_balance(db, user_id=1)


@router.get("", response_model=list[RewardOut], summary="Get active rewards catalogue")
def rewards_catalogue(db: Session = Depends(get_db)) -> list[RewardOut]:
    return list_active_rewards(db)


@router.post("/{reward_id}/redeem", response_model=RedeemRewardSuccessOut, summary="Redeem a reward (atomic)")
def redeem_reward_endpoint(reward_id: str, db: Session = Depends(get_db)) -> RedeemRewardSuccessOut:
    return redeem_reward(db, reward_id=reward_id, user_id=1)

