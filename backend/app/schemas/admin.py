from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User schemas for admin
class UserAdminResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    # Onboarding data
    field_of_study: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    interests: Optional[List[str]] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    career_goals: Optional[str] = None
    onboarding_completed: bool = False
    quiz_completed: bool = False
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserAdminResponse]
    total: int
    page: int
    per_page: int

# Learning Material schemas
class LearningMaterialCreate(BaseModel):
    title: str
    description: Optional[str] = None
    url: str
    category: Optional[str] = None
    field_of_study: Optional[str] = None
    resource_type: Optional[str] = None
    provider: Optional[str] = None
    level: Optional[str] = None
    duration: Optional[str] = None
    is_free: bool = False
    tags: Optional[List[str]] = None

class LearningMaterialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    category: Optional[str] = None
    field_of_study: Optional[str] = None
    resource_type: Optional[str] = None
    provider: Optional[str] = None
    level: Optional[str] = None
    duration: Optional[str] = None
    is_free: Optional[bool] = None
    is_active: Optional[bool] = None
    tags: Optional[List[str]] = None

class LearningMaterialResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    url: str
    category: Optional[str] = None
    field_of_study: Optional[str] = None
    resource_type: Optional[str] = None
    provider: Optional[str] = None
    level: Optional[str] = None
    duration: Optional[str] = None
    is_free: bool
    is_active: bool
    tags: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class LearningMaterialListResponse(BaseModel):
    materials: List[LearningMaterialResponse]
    total: int
    page: int
    per_page: int

# Dashboard stats
class AdminDashboardStats(BaseModel):
    total_users: int
    active_users: int
    completed_onboarding: int
    completed_quiz: int
    total_learning_materials: int
    users_by_field: dict
