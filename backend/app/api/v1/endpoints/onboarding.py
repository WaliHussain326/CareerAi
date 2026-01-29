from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.onboarding import OnboardingDataCreate, OnboardingDataUpdate, OnboardingDataResponse
from app.services.onboarding_service import OnboardingService

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

@router.post("", response_model=OnboardingDataResponse, status_code=status.HTTP_201_CREATED)
def create_onboarding_data(
    data: OnboardingDataCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or update onboarding data"""
    onboarding = OnboardingService.create_or_update_onboarding(db, current_user.id, data)
    return OnboardingDataResponse.from_orm(onboarding)

@router.put("", response_model=OnboardingDataResponse)
def update_onboarding_data(
    data: OnboardingDataUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update onboarding data"""
    onboarding = OnboardingService.create_or_update_onboarding(db, current_user.id, data)
    return OnboardingDataResponse.from_orm(onboarding)

@router.get("", response_model=OnboardingDataResponse)
def get_onboarding_data(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's onboarding data"""
    try:
        onboarding = OnboardingService.get_onboarding_data(db, current_user.id)
        return OnboardingDataResponse.from_orm(onboarding)
    except HTTPException:
        # Return empty data if not found
        from datetime import datetime
        return OnboardingDataResponse(
            id=0,
            user_id=current_user.id,
            step_completed=0,
            is_completed=False,
            profile_completeness=0,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

@router.get("/completeness")
def get_profile_completeness(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get profile completeness percentage"""
    try:
        onboarding = OnboardingService.get_onboarding_data(db, current_user.id)
        return {
            "completeness": onboarding.profile_completeness,
            "is_completed": onboarding.is_completed,
            "step_completed": onboarding.step_completed
        }
    except HTTPException:
        return {
            "completeness": 0,
            "is_completed": False,
            "step_completed": 0
        }
