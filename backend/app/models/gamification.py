from typing import Optional
from pydantic import BaseModel


class ShopItem(BaseModel):
    id: str
    name: str
    cost: int
    type: str  # consumable or cosmetic
    effect: Optional[dict] = None


class Achievement(BaseModel):
    id: int
    title: str
    desc: str
    icon: str
    color: str
    bg: str
    border: str
    unlocked: bool

