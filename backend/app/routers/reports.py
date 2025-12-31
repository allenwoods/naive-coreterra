from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("")
async def get_reports(
    type: Optional[str] = Query(None, description="Filter by report type (daily, weekly, monthly)"),
    current_user: dict = Depends(get_current_user)
):
    """Get all reports, optionally filtered by type"""
    reports = data_service.get_all("reports")
    if type:
        reports = [r for r in reports if r.get("type") == type]
    return reports


@router.get("/daily")
async def get_daily_report(current_user: dict = Depends(get_current_user)):
    """Get daily report"""
    reports = data_service.get_all("reports")
    daily_reports = [r for r in reports if r.get("type") == "daily"]
    # Return the most recent daily report or the first one if none found
    if daily_reports:
        return daily_reports[-1] if daily_reports else daily_reports[0]
    return None

