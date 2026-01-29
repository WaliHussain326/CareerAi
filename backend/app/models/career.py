from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class CareerRecommendation(Base):
    __tablename__ = "career_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Career Information
    career_title = Column(String, nullable=False)
    career_description = Column(Text, nullable=True)
    match_score = Column(Float, nullable=True)  # 0-100
    reasoning = Column(Text, nullable=True)  # AI explanation
    
    # Career Details
    required_skills = Column(JSON, nullable=True)  # Array of skills
    growth_potential = Column(String, nullable=True)
    salary_range = Column(String, nullable=True)
    work_environment = Column(String, nullable=True)
    
    # AI Generated Data
    ai_analysis = Column(JSON, nullable=True)  # Full AI response
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="career_recommendations")
    skill_gaps = relationship("SkillGap", back_populates="career_recommendation", cascade="all, delete-orphan")
    learning_roadmaps = relationship("LearningRoadmap", back_populates="career_recommendation", cascade="all, delete-orphan")

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    
    id = Column(Integer, primary_key=True, index=True)
    career_recommendation_id = Column(Integer, ForeignKey("career_recommendations.id"), nullable=False)
    
    skill_name = Column(String, nullable=False)
    current_level = Column(String, nullable=True)  # beginner, intermediate, advanced
    required_level = Column(String, nullable=True)
    priority = Column(String, nullable=True)  # high, medium, low
    estimated_time = Column(String, nullable=True)  # e.g., "3 months"
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    career_recommendation = relationship("CareerRecommendation", back_populates="skill_gaps")

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    career_recommendation_id = Column(Integer, ForeignKey("career_recommendations.id"), nullable=False)
    
    phase = Column(String, nullable=False)  # e.g., "Phase 1: Foundations"
    duration = Column(String, nullable=True)  # e.g., "3 months"
    objectives = Column(JSON, nullable=True)  # Array of learning objectives
    resources = Column(JSON, nullable=True)  # Array of learning resources
    order = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    career_recommendation = relationship("CareerRecommendation", back_populates="learning_roadmaps")
