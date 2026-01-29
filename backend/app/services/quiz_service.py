from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from fastapi import HTTPException, status
from app.models.quiz import QuizQuestion, QuizAnswer, QuizSubmission
from app.models.onboarding import OnboardingData
from app.schemas.quiz import QuizAnswerCreate

class QuizService:
    @staticmethod
    def get_all_questions(db: Session, section: Optional[str] = None) -> List[QuizQuestion]:
        query = db.query(QuizQuestion).filter(QuizQuestion.is_active == True)
        if section:
            query = query.filter(QuizQuestion.section == section)
        return query.order_by(QuizQuestion.order).all()
    
    @staticmethod
    def get_questions_for_user(db: Session, user_id: int, section: Optional[str] = None) -> List[QuizQuestion]:
        """Get questions filtered by user's field of study"""
        # Get user's field of study from onboarding
        onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user_id).first()
        field_of_study = onboarding.field_of_study if onboarding else None
        
        # Query for questions that either:
        # 1. Apply to all fields (field_of_study is NULL)
        # 2. Match the user's specific field of study
        query = db.query(QuizQuestion).filter(
            QuizQuestion.is_active == True,
            or_(
                QuizQuestion.field_of_study == None,
                QuizQuestion.field_of_study == field_of_study
            )
        )
        
        if section:
            query = query.filter(QuizQuestion.section == section)
        
        return query.order_by(QuizQuestion.order).all()
    
    @staticmethod
    def get_or_create_submission(db: Session, user_id: int) -> QuizSubmission:
        submission = db.query(QuizSubmission).filter(
            QuizSubmission.user_id == user_id
        ).order_by(QuizSubmission.created_at.desc()).first()
        
        if not submission:
            total_questions = db.query(func.count(QuizQuestion.id)).filter(
                QuizQuestion.is_active == True
            ).scalar()
            
            submission = QuizSubmission(
                user_id=user_id,
                total_questions=total_questions
            )
            db.add(submission)
            db.commit()
            db.refresh(submission)
        
        return submission
    
    @staticmethod
    def save_answer(db: Session, user_id: int, answer_data: QuizAnswerCreate) -> QuizAnswer:
        # Check if question exists
        question = db.query(QuizQuestion).filter(QuizQuestion.id == answer_data.question_id).first()
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found"
            )
        
        # Check if answer already exists
        existing_answer = db.query(QuizAnswer).filter(
            QuizAnswer.user_id == user_id,
            QuizAnswer.question_id == answer_data.question_id
        ).first()
        
        if existing_answer:
            existing_answer.answer = answer_data.answer
            db_answer = existing_answer
        else:
            db_answer = QuizAnswer(
                user_id=user_id,
                question_id=answer_data.question_id,
                answer=answer_data.answer
            )
            db.add(db_answer)
        
        db.commit()
        db.refresh(db_answer)
        
        # Update submission progress
        QuizService.update_submission_progress(db, user_id)
        
        return db_answer
    
    @staticmethod
    def update_submission_progress(db: Session, user_id: int):
        submission = QuizService.get_or_create_submission(db, user_id)
        
        # Count answered questions
        answered_count = db.query(func.count(QuizAnswer.id)).filter(
            QuizAnswer.user_id == user_id
        ).scalar()
        
        submission.answered_questions = answered_count
        
        # Get completed sections
        completed_sections = db.query(QuizQuestion.section).join(
            QuizAnswer, QuizQuestion.id == QuizAnswer.question_id
        ).filter(QuizAnswer.user_id == user_id).distinct().all()
        
        submission.completed_sections = [section[0] for section in completed_sections]
        
        db.commit()
    
    @staticmethod
    def submit_quiz(db: Session, user_id: int) -> QuizSubmission:
        submission = QuizService.get_or_create_submission(db, user_id)
        
        if submission.is_completed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quiz already completed"
            )
        
        # Verify minimum answers
        if submission.answered_questions < submission.total_questions * 0.7:  # At least 70%
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please answer at least 70% of questions before submitting"
            )
        
        from datetime import datetime
        submission.is_completed = True
        submission.submitted_at = datetime.utcnow()
        
        db.commit()
        db.refresh(submission)
        
        return submission
    
    @staticmethod
    def get_user_answers(db: Session, user_id: int) -> List[QuizAnswer]:
        return db.query(QuizAnswer).filter(QuizAnswer.user_id == user_id).all()
