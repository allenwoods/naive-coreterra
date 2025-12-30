from typing import Optional, List
from pydantic import BaseModel


class UserStats(BaseModel):
    focus: int
    execution: int
    planning: int
    teamwork: int
    expertise: int
    streak: int


class User(BaseModel):
    id: int
    name: str
    avatar: str
    role: str
    level: int
    currentXP: int
    maxXP: int
    gold: int
    streak: int
    inventory: List[str]
    stats: UserStats


class UserUpdate(BaseModel):
    name: Optional[str] = None
    level: Optional[int] = None
    currentXP: Optional[int] = None
    maxXP: Optional[int] = None
    gold: Optional[int] = None
    streak: Optional[int] = None
    inventory: Optional[List[str]] = None
    stats: Optional[UserStats] = None

