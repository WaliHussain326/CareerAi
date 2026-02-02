from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON
from datetime import datetime
from app.models.base import Base

class LearningMaterial(Base):
    __tablename__ = "learning_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=False)
    category = Column(String, nullable=True)  # e.g., "Web Dev", "AI/ML", "Finance"
    field_of_study = Column(String, nullable=True)  # NULL = applies to all
    resource_type = Column(String, nullable=True)  # "course", "article", "video", "book"
    provider = Column(String, nullable=True)  # e.g., "Udemy", "Coursera"
    level = Column(String, nullable=True)  # "Beginner", "Intermediate", "Advanced"
    duration = Column(String, nullable=True)  # e.g., "8 hours", "4 weeks"
    is_free = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    tags = Column(JSON, nullable=True)  # Array of tags
    created_by = Column(Integer, nullable=True)  # Admin user ID
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
