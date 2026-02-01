from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.onboarding import OnboardingData
from app.models.career import CareerRecommendation
from app.schemas.onboarding import OnboardingDataCreate, OnboardingDataUpdate

class OnboardingService:
    @staticmethod
    def calculate_completeness(data: OnboardingData) -> int:
        """Calculate profile completeness percentage"""
        total_fields = 14
        filled_fields = 0
        
        if data.age: filled_fields += 1
        if data.gender: filled_fields += 1
        if data.location: filled_fields += 1
        if data.education_level: filled_fields += 1
        if data.field_of_study: filled_fields += 1
        if data.institution: filled_fields += 1
        if data.graduation_year: filled_fields += 1
        if data.years_of_experience is not None: filled_fields += 1
        if data.current_role: filled_fields += 1
        if data.industry: filled_fields += 1
        if data.technical_skills: filled_fields += 1
        if data.soft_skills: filled_fields += 1
        if data.interests: filled_fields += 1
        if data.career_goals: filled_fields += 1
        
        return int((filled_fields / total_fields) * 100)
    
    @staticmethod
    def create_or_update_onboarding(
        db: Session,
        user_id: int,
        onboarding_data: OnboardingDataCreate | OnboardingDataUpdate
    ) -> OnboardingData:
        # Check if onboarding data exists
        db_data = db.query(OnboardingData).filter(OnboardingData.user_id == user_id).first()
        
        if db_data:
            # Update existing data
            for key, value in onboarding_data.model_dump(exclude_unset=True).items():
                setattr(db_data, key, value)
        else:
            # Create new data
            db_data = OnboardingData(user_id=user_id, **onboarding_data.model_dump(exclude_unset=True))
            db.add(db_data)

        # Clear existing recommendations whenever onboarding data changes
        existing_recommendations = db.query(CareerRecommendation).filter(
            CareerRecommendation.user_id == user_id
        ).all()
        for recommendation in existing_recommendations:
            db.delete(recommendation)
        
        # Calculate completeness
        db_data.profile_completeness = OnboardingService.calculate_completeness(db_data)
        
        # Mark as completed if all steps done
        if db_data.step_completed is not None and db_data.step_completed >= 4:
            db_data.is_completed = True
        
        db.commit()
        db.refresh(db_data)
        return db_data
    
    @staticmethod
    def get_onboarding_data(db: Session, user_id: int) -> OnboardingData:
        data = db.query(OnboardingData).filter(OnboardingData.user_id == user_id).first()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Onboarding data not found"
            )
        return data
