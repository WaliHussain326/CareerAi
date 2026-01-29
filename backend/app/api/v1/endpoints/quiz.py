from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.quiz import (
    QuizQuestionResponse,
    QuizAnswerCreate,
    QuizAnswerResponse,
    QuizSubmissionResponse,
    QuizProgressResponse
)
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.get("/questions", response_model=List[QuizQuestionResponse])
def get_quiz_questions(
    section: Optional[str] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get quiz questions filtered by user's field of study"""
    questions = QuizService.get_questions_for_user(db, current_user.id, section)
    return [QuizQuestionResponse.from_orm(q) for q in questions]

@router.post("/answers", response_model=QuizAnswerResponse)
def save_quiz_answer(
    answer: QuizAnswerCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Save or update a quiz answer"""
    db_answer = QuizService.save_answer(db, current_user.id, answer)
    return QuizAnswerResponse.from_orm(db_answer)

@router.get("/answers", response_model=List[QuizAnswerResponse])
def get_user_answers(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all answers for current user"""
    answers = QuizService.get_user_answers(db, current_user.id)
    return [QuizAnswerResponse.from_orm(a) for a in answers]

@router.get("/progress", response_model=QuizProgressResponse)
def get_quiz_progress(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get quiz progress for current user"""
    submission = QuizService.get_or_create_submission(db, current_user.id)
    
    progress_percentage = 0
    if submission.total_questions > 0:
        progress_percentage = (submission.answered_questions / submission.total_questions) * 100
    
    return QuizProgressResponse(
        total_questions=submission.total_questions,
        answered_questions=submission.answered_questions,
        progress_percentage=round(progress_percentage, 2),
        completed_sections=submission.completed_sections or [],
        is_completed=submission.is_completed
    )

@router.post("/submit", response_model=QuizSubmissionResponse)
def submit_quiz(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Submit quiz and mark as completed"""
    submission = QuizService.submit_quiz(db, current_user.id)
    return QuizSubmissionResponse.from_orm(submission)

@router.get("/submission", response_model=QuizSubmissionResponse)
def get_submission_status(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current quiz submission status"""
    submission = QuizService.get_or_create_submission(db, current_user.id)
    return QuizSubmissionResponse.from_orm(submission)
