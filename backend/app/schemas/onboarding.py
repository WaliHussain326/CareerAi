from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OnboardingDataBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[int] = None
    years_of_experience: Optional[int] = None
    current_role: Optional[str] = None
    industry: Optional[str] = None
    technical_skills: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_goals: Optional[str] = None

class OnboardingDataCreate(OnboardingDataBase):
    step_completed: Optional[int] = 0

class OnboardingDataUpdate(OnboardingDataBase):
    step_completed: Optional[int] = None

class OnboardingDataResponse(OnboardingDataBase):
    id: int
    user_id: int
    step_completed: int
    is_completed: bool
    profile_completeness: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
