from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Skill Gap Schemas
class SkillGapBase(BaseModel):
    skill_name: str
    current_level: Optional[str] = None
    required_level: Optional[str] = None
    priority: Optional[str] = None
    estimated_time: Optional[str] = None

class SkillGapResponse(SkillGapBase):
    id: int
    career_recommendation_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Learning Roadmap Schemas
class LearningRoadmapBase(BaseModel):
    phase: str
    duration: Optional[str] = None
    objectives: Optional[List[str]] = None
    resources: Optional[List[dict]] = None
    order: int = 0

class LearningRoadmapResponse(LearningRoadmapBase):
    id: int
    career_recommendation_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Career Recommendation Schemas
class CareerRecommendationBase(BaseModel):
    career_title: str
    career_description: Optional[str] = None
    match_score: Optional[float] = None
    reasoning: Optional[str] = None
    required_skills: Optional[List[str]] = None
    growth_potential: Optional[str] = None
    salary_range: Optional[str] = None
    work_environment: Optional[str] = None

class CareerRecommendationCreate(CareerRecommendationBase):
    ai_analysis: Optional[dict] = None

class CareerRecommendationResponse(CareerRecommendationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class CareerRecommendationDetailResponse(CareerRecommendationResponse):
    skill_gaps: List[SkillGapResponse] = []
    learning_roadmaps: List[LearningRoadmapResponse] = []

class GenerateRecommendationsRequest(BaseModel):
    force_regenerate: bool = False
