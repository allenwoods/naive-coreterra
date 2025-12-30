from typing import Optional, List
from pydantic import BaseModel
from enum import Enum


class TaskStatus(str, Enum):
    inbox = "inbox"
    clarified = "clarified"
    organized = "organized"
    scheduled = "scheduled"
    waiting = "waiting"
    completed = "completed"
    trash = "trash"


class Difficulty(str, Enum):
    Easy = "Easy"
    Med = "Med"
    Hard = "Hard"


class Subtask(BaseModel):
    id: int
    text: str
    done: bool = False


class Task(BaseModel):
    id: int
    title: str
    status: TaskStatus
    createdAt: Optional[str] = None
    priority: bool = False
    projectId: Optional[str] = None
    contextId: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    estimatedTime: Optional[str] = None
    xpReward: int = 0
    goldReward: Optional[int] = None
    subtasks: Optional[List[Subtask]] = None
    progress: Optional[int] = None
    assigneeId: Optional[int] = None
    description: Optional[str] = None
    dueDate: Optional[str] = None


class TaskCreate(BaseModel):
    title: str
    status: TaskStatus = TaskStatus.inbox
    priority: bool = False
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[bool] = None
    projectId: Optional[str] = None
    contextId: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    estimatedTime: Optional[str] = None
    xpReward: Optional[int] = None
    goldReward: Optional[int] = None
    subtasks: Optional[List[Subtask]] = None
    progress: Optional[int] = None
    assigneeId: Optional[int] = None
    description: Optional[str] = None
    dueDate: Optional[str] = None

