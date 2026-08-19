from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class RewardOut(BaseModel):
    id: str
    name: str
    description: str
    coinCost: int
    category: str
    value: str
    partner: str
    iconName: str
    badge: str | None = None


class RewardBalanceOut(BaseModel):
    user_id: int
    coin_balance: int


class RedemptionRecordOut(BaseModel):
    id: str
    rewardId: str
    rewardName: str
    coinCost: int
    redeemedAt: datetime
    code: str


class RedeemRewardSuccessOut(BaseModel):
    message: str
    reward_id: str
    coins_spent: int
    remaining_balance: int
    redemption: RedemptionRecordOut

