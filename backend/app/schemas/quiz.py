from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Quiz Question Schemas
class QuizQuestionBase(BaseModel):
    section: str
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    order: int = 0

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestionUpdate(BaseModel):
    section: Optional[str] = None
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    options: Optional[List[str]] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None

class QuizQuestionResponse(QuizQuestionBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Answer Schemas
class QuizAnswerCreate(BaseModel):
    question_id: int
    answer: Any  # Can be string, number, or array

class QuizAnswerResponse(BaseModel):
    id: int
    user_id: int
    question_id: int
    answer: Any
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Submission Schemas
class QuizSubmissionResponse(BaseModel):
    id: int
    user_id: int
    is_completed: bool
    completed_sections: Optional[List[str]] = None
    total_questions: int
    answered_questions: int
    submitted_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuizProgressResponse(BaseModel):
    total_questions: int
    answered_questions: int
    progress_percentage: float
    completed_sections: List[str]
    is_completed: bool
