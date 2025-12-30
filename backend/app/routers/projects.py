from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.project import Project, ProjectCreate, ProjectUpdate
from app.services.data_service import data_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[Project])
async def get_projects(current_user: dict = Depends(get_current_user)):
    """Get all projects"""
    return data_service.get_all("projects")


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Get a project by ID"""
    project = data_service.get_by_id("projects", project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", response_model=Project, status_code=201)
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new project"""
    project_dict = project.dict()
    project_dict["progress"] = 0
    project_dict["totalTasks"] = 0
    project_dict["completedTasks"] = 0
    # Generate ID
    projects = data_service.get_all("projects")
    project_dict["id"] = f"p{len(projects) + 1}"
    created = data_service.create("projects", project_dict)
    return created


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    updates: ProjectUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a project"""
    update_dict = updates.dict(exclude_unset=True)
    updated = data_service.update("projects", project_id, update_dict)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a project"""
    success = data_service.delete("projects", project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None

