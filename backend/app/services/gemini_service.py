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
                    "career_description": "Build scalable server-side systems and APIs that power modern applications. Work with databases, server architecture, and integration with external services.",
                    "match_score": 86.0,
                    "reasoning": "Based on your technical foundation and interest in system building, backend development offers a strong career path. Your problem-solving skills and analytical mindset are well-suited for building robust server architectures. This role allows you to work on challenging technical problems while having significant impact on product functionality.",
                    "required_skills": ["Python", "APIs", "Databases", "System Design", "Git"],
                    "growth_potential": "High",
                    "salary_range": "$70,000 - $120,000",
                    "work_environment": "Hybrid or Remote, cross-functional teams",
                    "skill_gaps": [
                        {"skill_name": "API Development", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Database Optimization", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "System Design", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "4 months"},
                        {"skill_name": "Cloud Services", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Security Best Practices", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Foundations", "duration": "3 months", "objectives": ["Master Python/Node.js fundamentals", "Learn SQL and database design", "Understand REST API principles", "Version control with Git"], "resources": [{"type": "course", "name": "Python for Backend Development", "provider": "Udemy"}, {"type": "course", "name": "SQL Masterclass", "provider": "Coursera"}]},
                        {"phase": "Phase 2: Core Skills", "duration": "3 months", "objectives": ["Build REST APIs with FastAPI/Express", "Database optimization techniques", "Authentication and authorization", "Testing strategies"], "resources": [{"type": "course", "name": "FastAPI Complete Guide", "provider": "Udemy"}, {"type": "documentation", "name": "PostgreSQL Official Docs", "provider": "PostgreSQL"}]},
                        {"phase": "Phase 3: Advanced Topics", "duration": "4 months", "objectives": ["Cloud deployment (AWS/GCP)", "Microservices architecture", "Message queues and caching", "Performance optimization"], "resources": [{"type": "certification", "name": "AWS Solutions Architect", "provider": "Amazon"}, {"type": "course", "name": "System Design Interview", "provider": "Educative"}]}
                    ]
                },
                {
                    "career_title": "Data Analyst",
                    "career_description": "Analyze data to surface insights and guide business decisions. Work with stakeholders to understand requirements and translate data into actionable recommendations.",
                    "match_score": 82.0,
                    "reasoning": "Your analytical mindset and attention to detail make data analysis a natural fit. The ability to extract meaningful insights from data and communicate findings clearly is increasingly valuable. This role bridges technical skills with business impact.",
                    "required_skills": ["SQL", "Excel", "Data Visualization", "Statistics", "Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$55,000 - $95,000",
                    "work_environment": "Office or Remote, analytics-driven teams",
                    "skill_gaps": [
                        {"skill_name": "SQL Querying", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Data Visualization", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Statistical Analysis", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Python/R", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "4 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Data Fundamentals", "duration": "2 months", "objectives": ["Master SQL for data analysis", "Excel advanced functions", "Basic statistics concepts", "Data cleaning techniques"], "resources": [{"type": "course", "name": "SQL for Data Analysis", "provider": "DataCamp"}, {"type": "course", "name": "Statistics Fundamentals", "provider": "Khan Academy"}]},
                        {"phase": "Phase 2: Visualization & Tools", "duration": "3 months", "objectives": ["Tableau/Power BI proficiency", "Python pandas library", "Dashboard creation", "Storytelling with data"], "resources": [{"type": "course", "name": "Tableau Complete Guide", "provider": "Udemy"}, {"type": "book", "name": "Storytelling with Data", "provider": "O'Reilly"}]},
                        {"phase": "Phase 3: Advanced Analytics", "duration": "3 months", "objectives": ["Predictive analytics basics", "A/B testing methodology", "Business metrics and KPIs", "Presentation skills"], "resources": [{"type": "course", "name": "Business Analytics Specialization", "provider": "Coursera"}, {"type": "certification", "name": "Google Data Analytics", "provider": "Google"}]}
                    ]
                },
                {
                    "career_title": "Cloud Engineer",
                    "career_description": "Deploy and manage cloud infrastructure for scalable applications. Work with containerization, automation, and infrastructure as code to enable rapid development cycles.",
                    "match_score": 80.0,
                    "reasoning": "Your interest in infrastructure and systems aligns well with cloud engineering. This fast-growing field combines technical depth with practical problem-solving. Cloud skills are in high demand across industries.",
                    "required_skills": ["AWS/Azure", "Linux", "Networking", "Automation", "Security"],
                    "growth_potential": "High",
                    "salary_range": "$80,000 - $140,000",
                    "work_environment": "Hybrid, DevOps collaboration",
                    "skill_gaps": [
                        {"skill_name": "Cloud Platforms (AWS/Azure)", "current_level": "not present", "required_level": "advanced", "priority": "high", "estimated_time": "6 months"},
                        {"skill_name": "Linux Administration", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Infrastructure as Code", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Containerization", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"},
                        {"skill_name": "Networking", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Cloud Foundations", "duration": "3 months", "objectives": ["Linux fundamentals", "Networking basics", "Cloud concepts overview", "One cloud provider basics (AWS/Azure)"], "resources": [{"type": "certification", "name": "AWS Cloud Practitioner", "provider": "Amazon"}, {"type": "course", "name": "Linux Essentials", "provider": "Linux Foundation"}]},
                        {"phase": "Phase 2: Core Cloud Skills", "duration": "4 months", "objectives": ["Compute and storage services", "Docker containerization", "Terraform/CloudFormation", "CI/CD pipelines"], "resources": [{"type": "certification", "name": "AWS Solutions Architect Associate", "provider": "Amazon"}, {"type": "course", "name": "Docker Mastery", "provider": "Udemy"}]},
                        {"phase": "Phase 3: Advanced Cloud", "duration": "4 months", "objectives": ["Kubernetes orchestration", "Multi-cloud strategies", "Security best practices", "Cost optimization"], "resources": [{"type": "certification", "name": "Certified Kubernetes Administrator", "provider": "CNCF"}, {"type": "course", "name": "AWS Security Specialty", "provider": "A Cloud Guru"}]}
                    ]
                }
            ]
        elif any(keyword in field for keyword in ["account", "finance", "econom", "audit"]):
            fallback_data = [
                {
                    "career_title": "Financial Analyst",
                    "career_description": "Evaluate financial data to support planning and investment decisions. Create financial models, analyze trends, and provide strategic recommendations to stakeholders.",
                    "match_score": 85.0,
                    "reasoning": "Your quantitative background and attention to detail are perfect for financial analysis. This role combines analytical skills with business strategy, allowing you to influence key decisions. The career path offers strong growth into senior analyst or management roles.",
                    "required_skills": ["Financial Modeling", "Excel", "Accounting Basics", "Reporting", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$55,000 - $110,000",
                    "work_environment": "Office or Hybrid, finance teams",
                    "skill_gaps": [
                        {"skill_name": "Financial Modeling", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Advanced Excel", "current_level": "intermediate", "required_level": "advanced", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Valuation Techniques", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Financial Statement Analysis", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Presentation Skills", "current_level": "intermediate", "required_level": "advanced", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Financial Foundations", "duration": "3 months", "objectives": ["Financial statement analysis", "Accounting fundamentals review", "Excel for finance", "Basic valuation concepts"], "resources": [{"type": "course", "name": "Financial Accounting Fundamentals", "provider": "Coursera"}, {"type": "course", "name": "Excel for Finance", "provider": "CFI"}]},
                        {"phase": "Phase 2: Analysis Skills", "duration": "3 months", "objectives": ["Build financial models", "DCF and comparable analysis", "Industry analysis", "Data visualization for finance"], "resources": [{"type": "course", "name": "Financial Modeling & Valuation", "provider": "Wall Street Prep"}, {"type": "certification", "name": "FMVA", "provider": "CFI"}]},
                        {"phase": "Phase 3: Advanced & Specialization", "duration": "4 months", "objectives": ["Sector-specific analysis", "M&A fundamentals", "Strategic planning support", "Executive presentation skills"], "resources": [{"type": "certification", "name": "CFA Level 1", "provider": "CFA Institute"}, {"type": "course", "name": "Investment Analysis", "provider": "Coursera"}]}
                    ]
                },
                {
                    "career_title": "Audit Associate",
                    "career_description": "Review financial records to ensure compliance and accuracy. Work with clients across industries, gaining broad business exposure while ensuring financial integrity.",
                    "match_score": 82.0,
                    "reasoning": "Your methodical approach and attention to compliance requirements align well with audit work. This role provides excellent foundational experience and exposure to diverse industries. Many successful finance leaders started in audit.",
                    "required_skills": ["Auditing", "Accounting Standards", "Risk Assessment", "Documentation", "Ethics"],
                    "growth_potential": "Medium",
                    "salary_range": "$50,000 - $90,000",
                    "work_environment": "Office, structured team environment",
                    "skill_gaps": [
                        {"skill_name": "Audit Procedures", "current_level": "not present", "required_level": "advanced", "priority": "high", "estimated_time": "6 months"},
                        {"skill_name": "GAAP/IFRS Standards", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Risk Assessment", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Audit Software", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Audit Fundamentals", "duration": "3 months", "objectives": ["Understand audit methodology", "Learn GAAP fundamentals", "Documentation standards", "Internal control concepts"], "resources": [{"type": "course", "name": "Auditing Fundamentals", "provider": "Coursera"}, {"type": "course", "name": "GAAP Overview", "provider": "Becker"}]},
                        {"phase": "Phase 2: Practical Skills", "duration": "4 months", "objectives": ["Audit testing procedures", "Risk assessment techniques", "Working paper preparation", "Client communication"], "resources": [{"type": "course", "name": "Audit Procedures and Techniques", "provider": "AICPA"}, {"type": "certification", "name": "CPA Exam Prep - AUD", "provider": "Becker"}]},
                        {"phase": "Phase 3: Specialization", "duration": "4 months", "objectives": ["Industry-specific auditing", "IT audit basics", "Fraud detection", "CPA certification prep"], "resources": [{"type": "certification", "name": "CPA", "provider": "AICPA"}, {"type": "course", "name": "Fraud Examination", "provider": "ACFE"}]}
                    ]
                },
                {
                    "career_title": "Tax Specialist",
                    "career_description": "Prepare and review tax filings while advising on tax strategy. Help individuals and organizations optimize their tax positions while ensuring compliance.",
                    "match_score": 80.0,
                    "reasoning": "Your finance background and detail orientation make tax specialization a strong fit. Tax expertise is always in demand, offering job stability and opportunities for specialization. This path can lead to advisory roles or leadership positions.",
                    "required_skills": ["Tax Law", "Compliance", "Excel", "Documentation", "Client Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$48,000 - $95,000",
                    "work_environment": "Office or Hybrid",
                    "skill_gaps": [
                        {"skill_name": "Tax Code Knowledge", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "6 months"},
                        {"skill_name": "Tax Software", "current_level": "not present", "required_level": "advanced", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Tax Planning Strategies", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "4 months"},
                        {"skill_name": "Research Skills", "current_level": "intermediate", "required_level": "advanced", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Tax Fundamentals", "duration": "3 months", "objectives": ["Individual tax basics", "Tax forms and schedules", "Tax software proficiency", "Research methods"], "resources": [{"type": "course", "name": "Federal Income Tax Fundamentals", "provider": "H&R Block"}, {"type": "course", "name": "Tax Research Methods", "provider": "Thomson Reuters"}]},
                        {"phase": "Phase 2: Core Tax Skills", "duration": "4 months", "objectives": ["Business entity taxation", "State and local taxes", "Tax planning strategies", "Client consultation"], "resources": [{"type": "course", "name": "Business Taxation", "provider": "Coursera"}, {"type": "certification", "name": "Enrolled Agent Exam Prep", "provider": "Gleim"}]},
                        {"phase": "Phase 3: Specialization", "duration": "4 months", "objectives": ["International tax basics", "Estate and trust taxation", "Tax controversy", "Advanced planning"], "resources": [{"type": "certification", "name": "Enrolled Agent", "provider": "IRS"}, {"type": "certification", "name": "CPA - REG", "provider": "Becker"}]}
                    ]
                }
            ]
        elif any(keyword in field for keyword in ["civil", "mechanical", "electrical", "chemical", "engineering"]):
            fallback_data = [
                {
                    "career_title": "Project Engineer",
                    "career_description": "Coordinate engineering projects from design through delivery. Manage timelines, resources, and stakeholder communication to ensure successful project completion.",
                    "match_score": 84.0,
                    "reasoning": "Your engineering foundation combined with organizational skills positions you well for project engineering. This role offers variety and leadership opportunities while staying technically engaged. It's an excellent stepping stone to project management.",
                    "required_skills": ["Project Planning", "Technical Documentation", "Problem Solving", "CAD", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$60,000 - $110,000",
                    "work_environment": "On-site or Hybrid",
                    "skill_gaps": [
                        {"skill_name": "Project Management Tools", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Scheduling & Planning", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Budget Management", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"},
                        {"skill_name": "Stakeholder Communication", "current_level": "intermediate", "required_level": "advanced", "priority": "medium", "estimated_time": "2 months"},
                        {"skill_name": "Risk Management", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Project Fundamentals", "duration": "3 months", "objectives": ["Project lifecycle understanding", "MS Project / Primavera basics", "Technical documentation", "Team coordination"], "resources": [{"type": "course", "name": "Project Management Fundamentals", "provider": "LinkedIn Learning"}, {"type": "course", "name": "MS Project Essentials", "provider": "Udemy"}]},
                        {"phase": "Phase 2: Core Competencies", "duration": "4 months", "objectives": ["Schedule development and tracking", "Budget and resource management", "Risk identification", "Vendor coordination"], "resources": [{"type": "certification", "name": "CAPM", "provider": "PMI"}, {"type": "course", "name": "Construction Project Management", "provider": "Coursera"}]},
                        {"phase": "Phase 3: Advanced Skills", "duration": "4 months", "objectives": ["Contract management basics", "Quality assurance", "Leadership skills", "PMP preparation"], "resources": [{"type": "certification", "name": "PMP", "provider": "PMI"}, {"type": "course", "name": "Engineering Leadership", "provider": "MIT OpenCourseWare"}]}
                    ]
                },
                {
                    "career_title": "Design Engineer",
                    "career_description": "Develop technical designs and prototypes for engineering products. Transform concepts into detailed specifications and working prototypes through iterative design.",
                    "match_score": 82.0,
                    "reasoning": "Your technical design skills and analytical approach are well-suited for design engineering. This creative yet methodical role allows you to see projects from concept to reality. Strong design engineers are valued across manufacturing industries.",
                    "required_skills": ["CAD", "Materials", "Simulation", "Testing", "Technical Writing"],
                    "growth_potential": "Medium",
                    "salary_range": "$58,000 - $105,000",
                    "work_environment": "Lab and office environments",
                    "skill_gaps": [
                        {"skill_name": "CAD Software (SolidWorks/AutoCAD)", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "FEA/Simulation", "current_level": "not present", "required_level": "intermediate", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Material Selection", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Prototyping", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Design Fundamentals", "duration": "3 months", "objectives": ["CAD software mastery", "GD&T fundamentals", "Design for manufacturing", "Basic material science"], "resources": [{"type": "course", "name": "SolidWorks Complete Course", "provider": "Udemy"}, {"type": "course", "name": "GD&T Fundamentals", "provider": "ASME"}]},
                        {"phase": "Phase 2: Analysis & Simulation", "duration": "4 months", "objectives": ["FEA basics", "Thermal analysis", "Design optimization", "Prototyping techniques"], "resources": [{"type": "course", "name": "FEA with ANSYS", "provider": "Coursera"}, {"type": "certification", "name": "CSWA", "provider": "Dassault Systèmes"}]},
                        {"phase": "Phase 3: Advanced Design", "duration": "4 months", "objectives": ["Complex assembly design", "Generative design", "Design review leadership", "Patent documentation"], "resources": [{"type": "certification", "name": "CSWP", "provider": "Dassault Systèmes"}, {"type": "course", "name": "Product Design", "provider": "Stanford Online"}]}
                    ]
                },
                {
                    "career_title": "Systems Engineer",
                    "career_description": "Integrate complex engineering systems and ensure reliability. Work across disciplines to optimize system performance and manage technical requirements.",
                    "match_score": 80.0,
                    "reasoning": "Your systems thinking and ability to see the big picture make systems engineering a strong fit. This role requires both technical depth and breadth, coordinating across multiple engineering domains. It's a pathway to technical leadership.",
                    "required_skills": ["Systems Thinking", "Requirements", "Testing", "Risk Analysis", "Communication"],
                    "growth_potential": "High",
                    "salary_range": "$65,000 - $115,000",
                    "work_environment": "Hybrid, cross-functional teams",
                    "skill_gaps": [
                        {"skill_name": "Systems Engineering Processes", "current_level": "not present", "required_level": "advanced", "priority": "high", "estimated_time": "6 months"},
                        {"skill_name": "Requirements Management", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Model-Based Systems Engineering", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "4 months"},
                        {"skill_name": "Verification & Validation", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: SE Fundamentals", "duration": "3 months", "objectives": ["Systems engineering lifecycle", "Requirements development", "Interface management", "Basic modeling"], "resources": [{"type": "course", "name": "Introduction to Systems Engineering", "provider": "MIT OpenCourseWare"}, {"type": "course", "name": "Requirements Engineering", "provider": "Coursera"}]},
                        {"phase": "Phase 2: Core SE Skills", "duration": "4 months", "objectives": ["System architecture", "Trade study analysis", "V&V planning", "Configuration management"], "resources": [{"type": "certification", "name": "ASEP", "provider": "INCOSE"}, {"type": "course", "name": "System Architecture", "provider": "edX"}]},
                        {"phase": "Phase 3: Advanced SE", "duration": "4 months", "objectives": ["MBSE with SysML", "Complex system integration", "Technical leadership", "CSEP preparation"], "resources": [{"type": "certification", "name": "CSEP", "provider": "INCOSE"}, {"type": "course", "name": "MBSE Fundamentals", "provider": "NoMagic"}]}
                    ]
                }
            ]
        elif any(keyword in field for keyword in ["business", "management", "marketing", "hr", "human"]):
            fallback_data = [
                {
                    "career_title": "Business Analyst",
                    "career_description": "Translate business needs into actionable requirements and insights. Bridge the gap between stakeholders and technical teams to deliver valuable solutions.",
                    "match_score": 84.0,
                    "reasoning": "Your strategic thinking and communication skills align perfectly with business analysis. This role is central to digital transformation efforts and offers exposure to various business functions. It's a versatile career with paths to product management or consulting.",
                    "required_skills": ["Requirements Gathering", "Process Mapping", "Communication", "Analysis", "Presentation"],
                    "growth_potential": "High",
                    "salary_range": "$55,000 - $105,000",
                    "work_environment": "Office or Hybrid",
                    "skill_gaps": [
                        {"skill_name": "Business Analysis Techniques", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Process Mapping Tools", "current_level": "not present", "required_level": "intermediate", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Requirements Documentation", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Data Analysis", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Agile/Scrum", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: BA Fundamentals", "duration": "3 months", "objectives": ["Requirements elicitation techniques", "Stakeholder management", "Business process basics", "Documentation standards"], "resources": [{"type": "course", "name": "Business Analysis Fundamentals", "provider": "Coursera"}, {"type": "course", "name": "Requirements Engineering", "provider": "Udemy"}]},
                        {"phase": "Phase 2: Core BA Skills", "duration": "3 months", "objectives": ["Process modeling (BPMN)", "User story writing", "Data analysis basics", "Agile BA practices"], "resources": [{"type": "certification", "name": "ECBA", "provider": "IIBA"}, {"type": "course", "name": "Agile Analysis", "provider": "LinkedIn Learning"}]},
                        {"phase": "Phase 3: Advanced BA", "duration": "4 months", "objectives": ["Solution evaluation", "Business case development", "Strategic analysis", "CBAP preparation"], "resources": [{"type": "certification", "name": "CBAP", "provider": "IIBA"}, {"type": "course", "name": "Strategic Business Analysis", "provider": "PMI"}]}
                    ]
                },
                {
                    "career_title": "Operations Coordinator",
                    "career_description": "Optimize processes and support day-to-day business operations. Ensure smooth execution of organizational activities and drive efficiency improvements.",
                    "match_score": 81.0,
                    "reasoning": "Your organizational skills and attention to process efficiency make operations a natural fit. This role provides broad exposure to business functions and develops valuable operational expertise. It can lead to operations management or specialized roles.",
                    "required_skills": ["Process Optimization", "Project Coordination", "Reporting", "Teamwork", "Tools"],
                    "growth_potential": "Medium",
                    "salary_range": "$45,000 - $85,000",
                    "work_environment": "Office or Hybrid",
                    "skill_gaps": [
                        {"skill_name": "Process Improvement", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Project Coordination", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Reporting & Analytics", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"},
                        {"skill_name": "ERP/Operations Software", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Operations Basics", "duration": "2 months", "objectives": ["Operations management fundamentals", "Process documentation", "Basic project coordination", "Reporting essentials"], "resources": [{"type": "course", "name": "Operations Management", "provider": "Coursera"}, {"type": "course", "name": "Excel for Business", "provider": "LinkedIn Learning"}]},
                        {"phase": "Phase 2: Process Skills", "duration": "3 months", "objectives": ["Lean principles", "Six Sigma basics", "KPI tracking", "Vendor management basics"], "resources": [{"type": "certification", "name": "Lean Six Sigma Yellow Belt", "provider": "ASQ"}, {"type": "course", "name": "Supply Chain Fundamentals", "provider": "edX"}]},
                        {"phase": "Phase 3: Advanced Operations", "duration": "4 months", "objectives": ["Process improvement projects", "ERP system proficiency", "Budget coordination", "Team leadership"], "resources": [{"type": "certification", "name": "Lean Six Sigma Green Belt", "provider": "ASQ"}, {"type": "course", "name": "Operations Analytics", "provider": "MIT Sloan"}]}
                    ]
                },
                {
                    "career_title": "Marketing Specialist",
                    "career_description": "Plan and execute campaigns to grow brand awareness and demand. Use data-driven insights to optimize marketing efforts and engage target audiences.",
                    "match_score": 79.0,
                    "reasoning": "Your creativity and communication skills are well-suited for marketing. The digital marketing landscape offers diverse specializations and growth paths. Marketing combines analytical thinking with creative execution.",
                    "required_skills": ["Campaign Planning", "Content", "Analytics", "SEO", "Communication"],
                    "growth_potential": "Medium",
                    "salary_range": "$45,000 - $90,000",
                    "work_environment": "Hybrid or Remote",
                    "skill_gaps": [
                        {"skill_name": "Digital Marketing", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Marketing Analytics", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Content Creation", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "SEO/SEM", "current_level": "not present", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Marketing Foundations", "duration": "2 months", "objectives": ["Marketing fundamentals", "Digital channels overview", "Content basics", "Brand principles"], "resources": [{"type": "course", "name": "Digital Marketing Fundamentals", "provider": "Google"}, {"type": "course", "name": "Content Marketing", "provider": "HubSpot"}]},
                        {"phase": "Phase 2: Core Marketing Skills", "duration": "3 months", "objectives": ["Social media marketing", "SEO fundamentals", "Email marketing", "Analytics and reporting"], "resources": [{"type": "certification", "name": "Google Analytics", "provider": "Google"}, {"type": "certification", "name": "HubSpot Inbound Marketing", "provider": "HubSpot"}]},
                        {"phase": "Phase 3: Specialization", "duration": "4 months", "objectives": ["Paid advertising (PPC)", "Marketing automation", "Campaign optimization", "Strategic planning"], "resources": [{"type": "certification", "name": "Google Ads", "provider": "Google"}, {"type": "course", "name": "Marketing Strategy", "provider": "Coursera"}]}
                    ]
                }
            ]
        else:
            fallback_data = [
                {
                    "career_title": "Research Associate",
                    "career_description": "Support research initiatives by collecting data and summarizing findings. Contribute to knowledge creation while developing expertise in your field of interest.",
                    "match_score": 80.0,
                    "reasoning": "Your curiosity and analytical mindset are perfect for research roles. This position allows you to deepen expertise while contributing to meaningful discoveries. It can lead to senior research positions or specialized careers.",
                    "required_skills": ["Research", "Data Collection", "Writing", "Critical Thinking", "Organization"],
                    "growth_potential": "Medium",
                    "salary_range": "$40,000 - $80,000",
                    "work_environment": "Office or Academic settings",
                    "skill_gaps": [
                        {"skill_name": "Research Methodology", "current_level": "beginner", "required_level": "advanced", "priority": "high", "estimated_time": "4 months"},
                        {"skill_name": "Data Analysis", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "3 months"},
                        {"skill_name": "Academic Writing", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Literature Review", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Research Fundamentals", "duration": "3 months", "objectives": ["Research methodology basics", "Literature review techniques", "Data collection methods", "Ethics in research"], "resources": [{"type": "course", "name": "Research Methods", "provider": "Coursera"}, {"type": "course", "name": "Academic Writing", "provider": "edX"}]},
                        {"phase": "Phase 2: Analysis Skills", "duration": "3 months", "objectives": ["Statistical analysis basics", "Qualitative research methods", "Research software tools", "Report writing"], "resources": [{"type": "course", "name": "Statistics for Research", "provider": "Khan Academy"}, {"type": "course", "name": "SPSS/R Basics", "provider": "DataCamp"}]},
                        {"phase": "Phase 3: Advanced Research", "duration": "4 months", "objectives": ["Advanced analysis techniques", "Grant writing basics", "Publication process", "Research presentation"], "resources": [{"type": "course", "name": "Advanced Research Methods", "provider": "Coursera"}, {"type": "course", "name": "Scientific Writing", "provider": "Stanford"}]}
                    ]
                },
                {
                    "career_title": "Project Coordinator",
                    "career_description": "Assist teams with planning, timelines, and stakeholder coordination. Ensure projects stay on track through effective organization and communication.",
                    "match_score": 78.0,
                    "reasoning": "Your organizational abilities and communication skills align well with project coordination. This role develops valuable project management experience across various contexts. It's a solid foundation for project management careers.",
                    "required_skills": ["Scheduling", "Communication", "Documentation", "Tools", "Teamwork"],
                    "growth_potential": "Medium",
                    "salary_range": "$42,000 - $75,000",
                    "work_environment": "Office or Hybrid",
                    "skill_gaps": [
                        {"skill_name": "Project Coordination Tools", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Scheduling", "current_level": "beginner", "required_level": "intermediate", "priority": "high", "estimated_time": "2 months"},
                        {"skill_name": "Stakeholder Communication", "current_level": "intermediate", "required_level": "advanced", "priority": "medium", "estimated_time": "3 months"},
                        {"skill_name": "Documentation", "current_level": "beginner", "required_level": "intermediate", "priority": "medium", "estimated_time": "2 months"}
                    ],
                    "learning_roadmap": [
                        {"phase": "Phase 1: Coordination Basics", "duration": "2 months", "objectives": ["Project coordination fundamentals", "Basic scheduling", "Documentation practices", "Tool proficiency"], "resources": [{"type": "course", "name": "Project Coordination Essentials", "provider": "LinkedIn Learning"}, {"type": "course", "name": "Asana/Monday.com Basics", "provider": "Udemy"}]},
                        {"phase": "Phase 2: Core Skills", "duration": "3 months", "objectives": ["Timeline management", "Meeting facilitation", "Status reporting", "Issue tracking"], "resources": [{"type": "certification", "name": "Google Project Management", "provider": "Google/Coursera"}, {"type": "course", "name": "Effective Communication", "provider": "LinkedIn Learning"}]},
                        {"phase": "Phase 3: Advanced Coordination", "duration": "3 months", "objectives": ["Risk identification", "Resource coordination", "Stakeholder management", "CAPM preparation"], "resources": [{"type": "certification", "name": "CAPM", "provider": "PMI"}, {"type": "course", "name": "Leadership Fundamentals", "provider": "Coursera"}]}
                    ]
                }
            ]
        
        recommendations = []
        for data in fallback_data:
            skill_gaps_data = data.pop("skill_gaps", [])
            roadmap_data = data.pop("learning_roadmap", [])
            
            rec = CareerRecommendation(user_id=user.id, **data)
            db.add(rec)
            db.flush()
            
            # Add skill gaps
            for gap in skill_gaps_data:
                skill_gap = SkillGap(
                    career_recommendation_id=rec.id,
                    skill_name=gap["skill_name"],
                    current_level=gap["current_level"],
                    required_level=gap["required_level"],
                    priority=gap["priority"],
                    estimated_time=gap["estimated_time"]
                )
                db.add(skill_gap)
            
            # Add learning roadmap
            for i, phase in enumerate(roadmap_data):
                roadmap = LearningRoadmap(
                    career_recommendation_id=rec.id,
                    phase=phase["phase"],
                    duration=phase["duration"],
                    objectives=phase["objectives"],
                    resources=phase["resources"],
                    order=i
                )
                db.add(roadmap)
            
            recommendations.append(rec)
        
        db.commit()
        return recommendations
