from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.gamification import ShopItem, Achievement
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/gamification", tags=["gamification"])


@router.get("/shop", response_model=List[ShopItem])
async def get_shop_items(current_user: dict = Depends(get_current_user)):
    """Get all shop items"""
    return data_service.get_all("shopItems")


@router.post("/shop/{item_id}/buy")
async def buy_shop_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """Buy a shop item"""
    item = data_service.get_by_id("shopItems", item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    user = data_service.get_by_id("users", current_user["user_id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cost = item.get("cost", 0)
    if user.get("gold", 0) < cost:
        raise HTTPException(status_code=400, detail="Not enough gold")
    
    # Deduct gold and add to inventory
    user["gold"] = user.get("gold", 0) - cost
    inventory = user.get("inventory", [])
    if item_id not in inventory:
        inventory.append(item_id)
    user["inventory"] = inventory
    
    data_service.update("users", current_user["user_id"], user)
    return {"message": "Purchase successful", "item": item}


@router.get("/achievements", response_model=List[Achievement])
async def get_achievements(current_user: dict = Depends(get_current_user)):
    """Get all achievements"""
    return data_service.get_all("achievements")

