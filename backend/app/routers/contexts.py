from fastapi import APIRouter, Depends
from typing import List
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/contexts", tags=["contexts"])


@router.get("")
async def get_contexts(current_user: dict = Depends(get_current_user)):
    """Get all contexts"""
    return data_service.get_all("contexts")


@router.get("/scheduled/categories")
async def get_scheduled_categories(current_user: dict = Depends(get_current_user)):
    """Get all scheduled categories"""
    return data_service.get_all("scheduledCategories")

