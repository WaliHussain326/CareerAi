from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class OnboardingData(Base):
    __tablename__ = "onboarding_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Personal Information
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    location = Column(String, nullable=True)
    
    # Education
    education_level = Column(String, nullable=True)
    field_of_study = Column(String, nullable=True)
    institution = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    
    # Experience
    years_of_experience = Column(Integer, nullable=True)
    current_role = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    
    # Skills & Interests
    technical_skills = Column(JSON, nullable=True)  # Array of skills
    soft_skills = Column(JSON, nullable=True)  # Array of skills
    interests = Column(JSON, nullable=True)  # Array of interests
    career_goals = Column(String, nullable=True)
    
    # Completion tracking
    step_completed = Column(Integer, default=0)  # 0-4 for onboarding steps
    is_completed = Column(Boolean, default=False)
    profile_completeness = Column(Integer, default=0)  # 0-100
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="onboarding_data")
