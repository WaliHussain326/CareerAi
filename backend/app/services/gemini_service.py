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
        onboarding = db.query(OnboardingData).filter(OnboardingData.user_id == user.id).first()
        field = (onboarding.field_of_study or "").lower() if onboarding else ""

        if any(keyword in field for keyword in ["computer", "software", "information", "data", "it"]):
            fallback_data = [
                {
                    "career_title": "Backend Developer",
                    "career_description": "Build scalable server-side systems and APIs that power modern applications.",
                    "match_score": 86.0,
                    "reasoning": "Your technical foundation and interest in system building fit backend development well.",
                    "required_skills": ["Python", "APIs", "Databases", "System Design", "Git"],
                    "growth_potential": "High",
                    "salary_range": "$70,000 - $120,000",
                    "work_environment": "Hybrid or Remote, cross-functional teams"
                },
                {
                    "career_title": "Data Analyst",
                    "career_description": "Analyze data to surface insights and guide business decisions.",
                    "match_score": 82.0,
                    "reasoning": "Your analytical skills translate well to data analysis roles.",
                    "required_skills": ["SQL", "Excel", "Data Visualization", "Statistics", "Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$55,000 - $95,000",
                    "work_environment": "Office or Remote, analytics-driven teams"
                },
                {
                    "career_title": "Cloud Engineer",
                    "career_description": "Deploy and manage cloud infrastructure for scalable applications.",
                    "match_score": 80.0,
                    "reasoning": "Your interest in infrastructure and systems makes cloud engineering a strong fit.",
                    "required_skills": ["AWS/Azure", "Linux", "Networking", "Automation", "Security"],
                    "growth_potential": "High",
                    "salary_range": "$80,000 - $140,000",
                    "work_environment": "Hybrid, DevOps collaboration"
                }
            ]
        elif any(keyword in field for keyword in ["account", "finance", "econom", "audit"]):
            fallback_data = [
                {
                    "career_title": "Financial Analyst",
                    "career_description": "Evaluate financial data to support planning and investment decisions.",
                    "match_score": 85.0,
                    "reasoning": "Your quantitative background aligns with financial analysis work.",
                    "required_skills": ["Financial Modeling", "Excel", "Accounting Basics", "Reporting", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$55,000 - $110,000",
                    "work_environment": "Office or Hybrid, finance teams"
                },
                {
                    "career_title": "Audit Associate",
                    "career_description": "Review financial records to ensure compliance and accuracy.",
                    "match_score": 82.0,
                    "reasoning": "Your attention to detail and interest in compliance make auditing a good fit.",
                    "required_skills": ["Auditing", "Accounting Standards", "Risk Assessment", "Documentation", "Ethics"],
                    "growth_potential": "Medium",
                    "salary_range": "$50,000 - $90,000",
                    "work_environment": "Office, structured team environment"
                },
                {
                    "career_title": "Tax Specialist",
                    "career_description": "Prepare and review tax filings while advising on tax strategy.",
                    "match_score": 80.0,
                    "reasoning": "Your finance knowledge and structure-oriented approach suit tax work.",
                    "required_skills": ["Tax Law", "Compliance", "Excel", "Documentation", "Client Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$48,000 - $95,000",
                    "work_environment": "Office or Hybrid"
                }
            ]
        elif any(keyword in field for keyword in ["civil", "mechanical", "electrical", "chemical", "engineering"]):
            fallback_data = [
                {
                    "career_title": "Project Engineer",
                    "career_description": "Coordinate engineering projects from design through delivery.",
                    "match_score": 84.0,
                    "reasoning": "Your engineering background supports project coordination and execution.",
                    "required_skills": ["Project Planning", "Technical Documentation", "Problem Solving", "CAD", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$60,000 - $110,000",
                    "work_environment": "On-site or Hybrid"
                },
                {
                    "career_title": "Design Engineer",
                    "career_description": "Develop technical designs and prototypes for engineering products.",
                    "match_score": 82.0,
                    "reasoning": "Your design and analytical skills align with product and system design work.",
                    "required_skills": ["CAD", "Materials", "Simulation", "Testing", "Technical Writing"],
                    "growth_potential": "Medium",
                    "salary_range": "$58,000 - $105,000",
                    "work_environment": "Lab and office environments"
                },
                {
                    "career_title": "Systems Engineer",
                    "career_description": "Integrate complex engineering systems and ensure reliability.",
                    "match_score": 80.0,
                    "reasoning": "Your systems thinking makes you well-suited for multi-discipline engineering roles.",
                    "required_skills": ["Systems Thinking", "Requirements", "Testing", "Risk Analysis", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$65,000 - $115,000",
                    "work_environment": "Hybrid, cross-functional teams"
                }
            ]
        elif any(keyword in field for keyword in ["business", "management", "marketing", "hr", "human"]):
            fallback_data = [
                {
                    "career_title": "Business Analyst",
                    "career_description": "Translate business needs into actionable requirements and insights.",
                    "match_score": 84.0,
                    "reasoning": "Your strategic mindset aligns with analysis and stakeholder collaboration.",
                    "required_skills": ["Requirements Gathering", "Process Mapping", "Communication", "Analysis", "Presentation"],
                    "growth_potential": "High",
                    "salary_range": "$55,000 - $105,000",
                    "work_environment": "Office or Hybrid"
                },
                {
                    "career_title": "Operations Coordinator",
                    "career_description": "Optimize processes and support day-to-day business operations.",
                    "match_score": 81.0,
                    "reasoning": "Your organizational skills support operational excellence roles.",
                    "required_skills": ["Process Optimization", "Project Coordination", "Reporting", "Teamwork", "Tools"],
                    "growth_potential": "Medium",
                    "salary_range": "$45,000 - $85,000",
                    "work_environment": "Office or Hybrid"
                },
                {
                    "career_title": "Marketing Specialist",
                    "career_description": "Plan and execute campaigns to grow brand awareness and demand.",
                    "match_score": 79.0,
                    "reasoning": "Your creativity and market focus align with marketing roles.",
                    "required_skills": ["Campaign Planning", "Content", "Analytics", "SEO", "Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$45,000 - $90,000",
                    "work_environment": "Hybrid or Remote"
                }
            ]
        else:
            fallback_data = [
                {
                    "career_title": "Research Associate",
                    "career_description": "Support research initiatives by collecting data and summarizing findings.",
                    "match_score": 80.0,
                    "reasoning": "Your curiosity and analytical mindset fit research-focused roles.",
                    "required_skills": ["Research", "Data Collection", "Writing", "Critical Thinking", "Organization"],
                    "growth_potential": "Medium",
                    "salary_range": "$40,000 - $80,000",
                    "work_environment": "Office or Academic settings"
                },
                {
                    "career_title": "Project Coordinator",
                    "career_description": "Assist teams with planning, timelines, and stakeholder coordination.",
                    "match_score": 78.0,
                    "reasoning": "Your communication skills align with coordinating project work.",
                    "required_skills": ["Scheduling", "Communication", "Documentation", "Tools", "Teamwork"],
                    "growth_potential": "Medium",
                    "salary_range": "$42,000 - $75,000",
                    "work_environment": "Office or Hybrid"
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
