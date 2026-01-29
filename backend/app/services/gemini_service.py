import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
import google.generativeai as genai
from app.core.config import settings
from app.models.user import User
from app.models.onboarding import OnboardingData
from app.models.quiz import QuizAnswer, QuizQuestion
from app.models.career import CareerRecommendation, SkillGap, LearningRoadmap

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    @staticmethod
    def prepare_user_profile(db: Session, user: User) -> Dict[str, Any]:
        """Prepare user profile data for AI analysis"""
        onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
        answers = db.query(QuizAnswer).filter(QuizAnswer.user_id == user.id).all()
        
        # Organize quiz answers by section
        quiz_data = {}
        for answer in answers:
            question = db.query(QuizQuestion).filter(QuizQuestion.id == answer.question_id).first()
            if question:
                if question.section not in quiz_data:
                    quiz_data[question.section] = []
                quiz_data[question.section].append({
                    "question": question.question_text,
                    "answer": answer.answer
                })
        
        profile = {
            "personal": {
                "age": onboarding.age if onboarding else None,
                "location": onboarding.location if onboarding else None,
            },
            "education": {
                "level": onboarding.education_level if onboarding else None,
                "field": onboarding.field_of_study if onboarding else None,
                "graduation_year": onboarding.graduation_year if onboarding else None,
            },
            "experience": {
                "years": onboarding.years_of_experience if onboarding else None,
                "current_role": onboarding.current_role if onboarding else None,
                "industry": onboarding.industry if onboarding else None,
            },
            "skills": {
                "technical": onboarding.technical_skills if onboarding else [],
                "soft": onboarding.soft_skills if onboarding else [],
            },
            "interests": onboarding.interests if onboarding else [],
            "career_goals": onboarding.career_goals if onboarding else "",
            "quiz_responses": quiz_data
        }
        
        return profile
    
    @staticmethod
    def generate_career_recommendations(db: Session, user: User) -> List[CareerRecommendation]:
        """Generate career recommendations using Gemini AI"""
        profile = GeminiService.prepare_user_profile(db, user)
        
        prompt = f"""
You are an expert career counselor. Analyze the following user profile and provide 3-5 HIGHLY SPECIFIC personalized career recommendations.

User Profile:
{json.dumps(profile, indent=2)}

IMPORTANT INSTRUCTIONS FOR CAREER TITLES:
- Be VERY SPECIFIC with career titles. Don't use generic terms like "Software Engineer" or "Accountant"
- For Computer Science/IT field: Use titles like "Backend Developer", "Frontend Developer", "Full Stack Developer", "DevOps Engineer", "Machine Learning Engineer", "Computer Vision Engineer", "Data Scientist", "Mobile App Developer", "Cloud Architect"
- For Accounting/Finance field: Use titles like "Tax Accountant", "Forensic Accountant", "Management Accountant", "Financial Analyst", "Auditor", "Bookkeeper", "Payroll Specialist"
- For Engineering fields: Use titles like "Structural Engineer", "Electrical Systems Engineer", "Power Systems Engineer", "Civil Infrastructure Engineer", "HVAC Engineer"
- For Business/Management: Use titles like "Business Analyst", "Operations Manager", "Product Manager", "HR Manager", "Marketing Manager"
- Match the specificity to the user's field of study and interests

For each career recommendation, provide:
1. SPECIFIC Career title (not generic)
2. Detailed description (2-3 sentences)
3. Match score (0-100) based on their profile
4. Reasoning for the recommendation
5. Required skills (list of 5-8 skills)
6. Growth potential (High/Medium/Low)
7. Salary range (e.g., "$60,000 - $90,000")
8. Work environment description
9. Top 5 skill gaps with:
   - Skill name
   - Current level (beginner/intermediate/advanced or "not present")
   - Required level (intermediate/advanced/expert)
   - Priority (high/medium/low)
   - Estimated time to acquire
10. Learning roadmap with 3-4 phases:
   - Phase name
   - Duration
   - Learning objectives (3-5 items)
   - Resources (courses, books, certifications)

Return ONLY a valid JSON array with this exact structure:
[
  {{
    "career_title": "...",
    "career_description": "...",
    "match_score": 85,
    "reasoning": "...",
    "required_skills": ["skill1", "skill2", ...],
    "growth_potential": "High",
    "salary_range": "$...",
    "work_environment": "...",
    "skill_gaps": [
      {{
        "skill_name": "...",
        "current_level": "...",
        "required_level": "...",
        "priority": "high",
        "estimated_time": "3 months"
      }}
    ],
    "learning_roadmap": [
      {{
        "phase": "Phase 1: Foundations",
        "duration": "3 months",
        "objectives": ["...", "..."],
        "resources": [{{"type": "course", "name": "...", "provider": "..."}}, ...]
      }}
    ]
  }}
]
"""
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            # Parse response
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            recommendations_data = json.loads(response_text.strip())
            
            # Save recommendations to database
            saved_recommendations = []
            for rec_data in recommendations_data:
                recommendation = CareerRecommendation(
                    user_id=user.id,
                    career_title=rec_data["career_title"],
                    career_description=rec_data["career_description"],
                    match_score=rec_data["match_score"],
                    reasoning=rec_data["reasoning"],
                    required_skills=rec_data["required_skills"],
                    growth_potential=rec_data["growth_potential"],
                    salary_range=rec_data["salary_range"],
                    work_environment=rec_data["work_environment"],
                    ai_analysis=rec_data
                )
                db.add(recommendation)
                db.flush()
                
                # Save skill gaps
                for gap_data in rec_data.get("skill_gaps", []):
                    skill_gap = SkillGap(
                        career_recommendation_id=recommendation.id,
                        skill_name=gap_data["skill_name"],
                        current_level=gap_data["current_level"],
                        required_level=gap_data["required_level"],
                        priority=gap_data["priority"],
                        estimated_time=gap_data["estimated_time"]
                    )
                    db.add(skill_gap)
                
                # Save learning roadmap
                for i, roadmap_data in enumerate(rec_data.get("learning_roadmap", [])):
                    roadmap = LearningRoadmap(
                        career_recommendation_id=recommendation.id,
                        phase=roadmap_data["phase"],
                        duration=roadmap_data["duration"],
                        objectives=roadmap_data["objectives"],
                        resources=roadmap_data["resources"],
                        order=i
                    )
                    db.add(roadmap)
                
                saved_recommendations.append(recommendation)
            
            db.commit()
            
            for rec in saved_recommendations:
                db.refresh(rec)
            
            return saved_recommendations
            
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            # Fallback to sample data if AI fails
            return GeminiService.create_fallback_recommendations(db, user)
    
    @staticmethod
    def create_fallback_recommendations(db: Session, user: User) -> List[CareerRecommendation]:
        """Create fallback recommendations if AI fails"""
        fallback_data = [
            {
                "career_title": "Software Engineer",
                "career_description": "Design, develop, and maintain software applications.",
                "match_score": 85.0,
                "reasoning": "Your technical skills and problem-solving abilities align well with this role.",
                "required_skills": ["Python", "JavaScript", "SQL", "Git", "Problem Solving"],
                "growth_potential": "High",
                "salary_range": "$70,000 - $120,000",
                "work_environment": "Office or Remote, Collaborative team environment"
            }
        ]
        
        recommendations = []
        for data in fallback_data:
            rec = CareerRecommendation(user_id=user.id, **data)
            db.add(rec)
            db.flush()
            recommendations.append(rec)
        
        db.commit()
        return recommendations
