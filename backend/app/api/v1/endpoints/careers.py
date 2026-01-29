from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.career import CareerRecommendation, SkillGap, LearningRoadmap
from app.schemas.career import (
    CareerRecommendationResponse,
    CareerRecommendationDetailResponse,
    SkillGapResponse,
    LearningRoadmapResponse,
    GenerateRecommendationsRequest
)
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/careers", tags=["Career Recommendations"])

@router.post("/generate", response_model=List[CareerRecommendationResponse])
def generate_recommendations(
    request: GenerateRecommendationsRequest = GenerateRecommendationsRequest(),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Generate career recommendations using AI"""
    # Check if recommendations already exist
    existing = db.query(CareerRecommendation).filter(
        CareerRecommendation.user_id == current_user.id
    ).first()
    
    if existing and not request.force_regenerate:
        # Return existing recommendations
        recommendations = db.query(CareerRecommendation).filter(
            CareerRecommendation.user_id == current_user.id
        ).all()
        return [CareerRecommendationResponse.from_orm(r) for r in recommendations]
    
    # Delete existing recommendations if force regenerate
    if existing and request.force_regenerate:
        db.query(CareerRecommendation).filter(
            CareerRecommendation.user_id == current_user.id
        ).delete()
        db.commit()
    
    # Generate new recommendations
    recommendations = GeminiService.generate_career_recommendations(db, current_user)
    return [CareerRecommendationResponse.from_orm(r) for r in recommendations]

@router.get("", response_model=List[CareerRecommendationResponse])
def get_recommendations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all career recommendations for current user"""
    recommendations = db.query(CareerRecommendation).filter(
        CareerRecommendation.user_id == current_user.id
    ).order_by(CareerRecommendation.match_score.desc()).all()
    
    if not recommendations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No recommendations found. Please generate recommendations first."
        )
    
    return [CareerRecommendationResponse.from_orm(r) for r in recommendations]

@router.get("/{career_id}", response_model=CareerRecommendationDetailResponse)
def get_career_detail(
    career_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific career recommendation"""
    career = db.query(CareerRecommendation).filter(
        CareerRecommendation.id == career_id,
        CareerRecommendation.user_id == current_user.id
    ).first()
    
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career recommendation not found"
        )
    
    return CareerRecommendationDetailResponse.from_orm(career)

@router.get("/{career_id}/skill-gaps", response_model=List[SkillGapResponse])
def get_skill_gaps(
    career_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get skill gaps for a specific career"""
    # Verify career belongs to user
    career = db.query(CareerRecommendation).filter(
        CareerRecommendation.id == career_id,
        CareerRecommendation.user_id == current_user.id
    ).first()
    
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career recommendation not found"
        )
    
    skill_gaps = db.query(SkillGap).filter(
        SkillGap.career_recommendation_id == career_id
    ).all()
    
    return [SkillGapResponse.from_orm(sg) for sg in skill_gaps]

@router.get("/{career_id}/roadmap", response_model=List[LearningRoadmapResponse])
def get_learning_roadmap(
    career_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get learning roadmap for a specific career"""
    # Verify career belongs to user
    career = db.query(CareerRecommendation).filter(
        CareerRecommendation.id == career_id,
        CareerRecommendation.user_id == current_user.id
    ).first()
    
    if not career:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career recommendation not found"
        )
    
    roadmap = db.query(LearningRoadmap).filter(
        LearningRoadmap.career_recommendation_id == career_id
    ).order_by(LearningRoadmap.order).all()
    
    return [LearningRoadmapResponse.from_orm(lr) for lr in roadmap]
