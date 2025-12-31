from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/teams", tags=["teams"])


@router.get("")
async def get_teams(current_user: dict = Depends(get_current_user)):
    """Get all team members"""
    return data_service.get_all("teams")

