from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..dependencies import get_db
from ..schemas.analytics import CategoryAnalyticsItemOut, MonthlySpendingItemOut, SummaryMetricsOut
from ..services.analytics_service import category_analytics, monthly_analytics, summary_metrics

router = APIRouter(prefix="/api/analytics")


@router.get("/category", summary="Spending analytics by category")
def get_category_analytics(db: Session = Depends(get_db)) -> list[CategoryAnalyticsItemOut]:
    return category_analytics(db)


@router.get("/monthly", summary="Monthly successful spending analytics")
def get_monthly_analytics(db: Session = Depends(get_db)) -> list[MonthlySpendingItemOut]:
    return monthly_analytics(db)


@router.get("/summary", summary="Dashboard summary metrics")
def get_summary(db: Session = Depends(get_db)) -> SummaryMetricsOut:
    return summary_metrics(db, demo_user_id=1)

