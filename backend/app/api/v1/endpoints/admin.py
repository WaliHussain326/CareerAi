from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.dependencies import get_current_admin_user, get_current_active_user
from app.models.user import User
from app.models.quiz import QuizQuestion, QuizSubmission
from app.models.career import CareerRecommendation
from app.models.onboarding import OnboardingData
from app.models.learning import LearningMaterial
from app.schemas.quiz import QuizQuestionCreate, QuizQuestionUpdate, QuizQuestionResponse
from app.schemas.admin import (
    UserAdminResponse,
    UserListResponse,
    LearningMaterialCreate,
    LearningMaterialUpdate,
    LearningMaterialResponse,
    LearningMaterialListResponse,
    AdminDashboardStats
)

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


# Enhanced Dashboard Stats
@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get admin dashboard statistics"""
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()
    
    completed_onboarding = db.query(func.count(OnboardingData.id)).filter(
        OnboardingData.is_completed == True
    ).scalar()
    
    completed_quiz = db.query(func.count(QuizSubmission.id)).filter(
        QuizSubmission.is_completed == True
    ).scalar()
    
    total_learning_materials = db.query(func.count(LearningMaterial.id)).filter(
        LearningMaterial.is_active == True
    ).scalar()
    
    # Users by field of study
    field_counts = db.query(
        OnboardingData.field_of_study,
        func.count(OnboardingData.id)
    ).filter(
        OnboardingData.field_of_study != None
    ).group_by(OnboardingData.field_of_study).all()
    
    users_by_field = {field: count for field, count in field_counts if field}
    
    return AdminDashboardStats(
        total_users=total_users or 0,
        active_users=active_users or 0,
        completed_onboarding=completed_onboarding or 0,
        completed_quiz=completed_quiz or 0,
        total_learning_materials=total_learning_materials or 0,
        users_by_field=users_by_field
    )


# Enhanced User Management
@router.get("/users/detailed", response_model=UserListResponse)
def get_detailed_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    field_of_study: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get all users with their onboarding data"""
    query = db.query(User)
    
    # Filter by search term (email or name)
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) |
            (User.full_name.ilike(f"%{search}%"))
        )
    
    # Get total count before pagination
    total = query.count()
    
    # Paginate
    users = query.offset((page - 1) * per_page).limit(per_page).all()
    
    # Build response with onboarding data
    user_responses = []
    for user in users:
        onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
        quiz = db.query(QuizSubmission).filter(
            QuizSubmission.user_id == user.id,
            QuizSubmission.is_completed == True
        ).first()
        
        # Filter by field of study if specified
        if field_of_study:
            if not onboarding or onboarding.field_of_study != field_of_study:
                continue
        
        user_response = UserAdminResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            is_admin=(user.role == "admin"),
            created_at=user.created_at,
            field_of_study=onboarding.field_of_study if onboarding else None,
            education_level=onboarding.education_level if onboarding else None,
            institution=onboarding.institution if onboarding else None,
            interests=onboarding.interests if onboarding else None,
            technical_skills=onboarding.technical_skills if onboarding else None,
            soft_skills=onboarding.soft_skills if onboarding else None,
            career_goals=onboarding.career_goals if onboarding else None,
            onboarding_completed=onboarding.is_completed if onboarding else False,
            quiz_completed=quiz is not None
        )
        user_responses.append(user_response)
    
    return UserListResponse(
        users=user_responses,
        total=total,
        page=page,
        per_page=per_page
    )


@router.get("/users/{user_id}/detail", response_model=UserAdminResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get detailed user information"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
    quiz = db.query(QuizSubmission).filter(
        QuizSubmission.user_id == user.id,
        QuizSubmission.is_completed == True
    ).first()
    
    return UserAdminResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_admin=(user.role == "admin"),
        created_at=user.created_at,
        field_of_study=onboarding.field_of_study if onboarding else None,
        education_level=onboarding.education_level if onboarding else None,
        institution=onboarding.institution if onboarding else None,
        interests=onboarding.interests if onboarding else None,
        technical_skills=onboarding.technical_skills if onboarding else None,
        soft_skills=onboarding.soft_skills if onboarding else None,
        career_goals=onboarding.career_goals if onboarding else None,
        onboarding_completed=onboarding.is_completed if onboarding else False,
        quiz_completed=quiz is not None
    )


# Learning Materials Management
@router.get("/learning-materials", response_model=LearningMaterialListResponse)
def get_all_learning_materials(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    field_of_study: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Get all learning materials"""
    query = db.query(LearningMaterial)
    
    if category:
        query = query.filter(LearningMaterial.category == category)
    if field_of_study:
        query = query.filter(
            (LearningMaterial.field_of_study == field_of_study) |
            (LearningMaterial.field_of_study == None)
        )
    if is_active is not None:
        query = query.filter(LearningMaterial.is_active == is_active)
    
    total = query.count()
    materials = query.order_by(LearningMaterial.created_at.desc()).offset(
        (page - 1) * per_page
    ).limit(per_page).all()
    
    return LearningMaterialListResponse(
        materials=[LearningMaterialResponse.from_orm(m) for m in materials],
        total=total,
        page=page,
        per_page=per_page
    )


@router.post("/learning-materials", response_model=LearningMaterialResponse)
def create_learning_material(
    material: LearningMaterialCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Create a new learning material"""
    db_material = LearningMaterial(
        **material.dict(),
        created_by=admin_user.id,
        is_active=True
    )
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return LearningMaterialResponse.from_orm(db_material)


@router.put("/learning-materials/{material_id}", response_model=LearningMaterialResponse)
def update_learning_material(
    material_id: int,
    material: LearningMaterialUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Update a learning material"""
    db_material = db.query(LearningMaterial).filter(LearningMaterial.id == material_id).first()
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning material not found"
        )
    
    update_data = material.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_material, key, value)
    
    db.commit()
    db.refresh(db_material)
    return LearningMaterialResponse.from_orm(db_material)


@router.delete("/learning-materials/{material_id}")
def delete_learning_material(
    material_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """Delete a learning material"""
    db_material = db.query(LearningMaterial).filter(LearningMaterial.id == material_id).first()
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Learning material not found"
        )
    
    db.delete(db_material)
    db.commit()
    return {"message": "Learning material deleted successfully"}


# Public endpoint for learning materials (for the Learning page)
@router.get("/public/learning-materials", response_model=List[LearningMaterialResponse])
def get_public_learning_materials(
    category: Optional[str] = None,
    field_of_study: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get active learning materials for users"""
    query = db.query(LearningMaterial).filter(LearningMaterial.is_active == True)
    
    if category:
        query = query.filter(LearningMaterial.category == category)
    if field_of_study:
        query = query.filter(
            (LearningMaterial.field_of_study == field_of_study) |
            (LearningMaterial.field_of_study == None)
        )
    if level:
        query = query.filter(LearningMaterial.level == level)
    
    materials = query.order_by(LearningMaterial.created_at.desc()).limit(50).all()
    return [LearningMaterialResponse.from_orm(m) for m in materials]
