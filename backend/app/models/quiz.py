from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String, nullable=False)  # e.g., "personality", "skills", "interests", "work_preferences"
    question_text = Column(Text, nullable=False)
    question_type = Column(String, nullable=False)  # "multiple_choice", "scale", "text", "multi_select"
    options = Column(JSON, nullable=True)  # Array of options for multiple choice
    field_of_study = Column(String, nullable=True)  # NULL = applies to all fields, or specific field like "Computer Science", "Accounting"
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    answers = relationship("QuizAnswer", back_populates="question")

class QuizAnswer(Base):
    __tablename__ = "quiz_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("quiz_questions.id"), nullable=False)
    answer = Column(JSON, nullable=False)  # Can be string, number, or array
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="quiz_answers")
    question = relationship("QuizQuestion", back_populates="answers")

class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    completed_sections = Column(JSON, nullable=True)  # Array of completed sections
    total_questions = Column(Integer, default=0)
    answered_questions = Column(Integer, default=0)
    submitted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="quiz_submissions")
