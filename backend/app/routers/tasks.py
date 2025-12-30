from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.task import Task, TaskCreate, TaskUpdate, TaskStatus
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=List[Task])
async def get_tasks(
    status: Optional[TaskStatus] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all tasks, optionally filtered by status"""
    tasks = data_service.get_all("tasks")
    if status:
        tasks = [t for t in tasks if t.get("status") == status.value]
    return tasks


@router.get("/{task_id}", response_model=Task)
async def get_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """Get a task by ID"""
    task = data_service.get_by_id("tasks", task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("", response_model=Task, status_code=201)
async def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new task"""
    task_dict = task.dict()
    task_dict["createdAt"] = task_dict.get("createdAt") or __import__("datetime").datetime.utcnow().isoformat()
    task_dict["xpReward"] = 0
    created = data_service.create("tasks", task_dict)
    return created


@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    updates: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a task"""
    update_dict = updates.dict(exclude_unset=True)
    updated = data_service.update("tasks", task_id, update_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", status_code=204)
async def delete_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """Delete a task"""
    success = data_service.delete("tasks", task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return None


@router.post("/{task_id}/complete", response_model=Task)
async def complete_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """Mark a task as completed and award XP/gold"""
    task = data_service.get_by_id("tasks", task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update task status
    task["status"] = "completed"
    
    # Award XP and gold to user
    user = data_service.get_by_id("users", current_user["user_id"])
    if user:
        xp_reward = task.get("xpReward", 50)
        gold_reward = int(xp_reward * 0.5)
        
        user["currentXP"] = user.get("currentXP", 0) + xp_reward
        user["gold"] = user.get("gold", 0) + gold_reward
        
        # Check for level up
        if user["currentXP"] >= user.get("maxXP", 500):
            user["level"] = user.get("level", 1) + 1
            user["currentXP"] = 0
            user["maxXP"] = int(user.get("maxXP", 500) * 1.2)
        
        data_service.update("users", current_user["user_id"], user)
    
    updated = data_service.update("tasks", task_id, task)
    return updated

