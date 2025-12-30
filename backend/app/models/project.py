from typing import Optional
from pydantic import BaseModel


class Project(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    progress: int
    totalTasks: int
    completedTasks: int
    timeline: Optional[dict] = None


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[int] = None
    totalTasks: Optional[int] = None
    completedTasks: Optional[int] = None

