from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User, UserUpdate
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    user = data_service.get_by_id("users", current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me", response_model=User)
async def update_current_user(
    updates: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user information"""
    update_dict = updates.dict(exclude_unset=True)
    updated = data_service.update("users", current_user["user_id"], update_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

