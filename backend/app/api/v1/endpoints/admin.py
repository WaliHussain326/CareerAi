from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.dependencies import get_current_admin_user
from app.models.user import User
from app.models.quiz import QuizQuestion
from app.models.career import CareerRecommendation
from app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionResponse

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/analytics")
def get_analytics(
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get basic platform analytics"""
    total_users = db.query(func.count(User.id)).scalar()
    total_recommendations = db.query(func.count(CareerRecommendation.id)).scalar()
    total_questions = db.query(func.count(QuizQuestion.id)).filter(
        QuizQuestion.is_active == True
    ).scalar()
    
    return {
        "total_users": total_users,
        "total_recommendations": total_recommendations,
        "total_quiz_questions": total_questions,
        "active_users": db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    }

@router.get("/quiz-questions", response_model=List[QuizQuestionResponse])
def get_all_quiz_questions(
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all quiz questions (including inactive)"""
    questions = db.query(QuizQuestion).order_by(QuizQuestion.section, QuizQuestion.order).all()
    return [QuizQuestionResponse.from_orm(q) for q in questions]

@router.post("/quiz-questions", response_model=QuizQuestionResponse, status_code=status.HTTP_201_CREATED)
def create_quiz_question(
    question: QuizQuestionCreate,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new quiz question"""
    db_question = QuizQuestion(**question.model_dump())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return QuizQuestionResponse.from_orm(db_question)

@router.put("/quiz-questions/{question_id}", response_model=QuizQuestionResponse)
def update_quiz_question(
    question_id: int,
    question_update: QuizQuestionUpdate,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Update a quiz question"""
    db_question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    
    if not db_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    for key, value in question_update.model_dump(exclude_unset=True).items():
        setattr(db_question, key, value)
    
    db.commit()
    db.refresh(db_question)
    return QuizQuestionResponse.from_orm(db_question)

@router.delete("/quiz-questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz_question(
    question_id: int,
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a quiz question (soft delete - mark as inactive)"""
    db_question = db.query(QuizQuestion).filter(QuizQuestion.id == question_id).first()
    
    if not db_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    db_question.is_active = False
    db.commit()
    return None

@router.get("/users")
def get_all_users(
    admin_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role, "is_active": u.is_active} for u in users]
