"""
Seed data for quiz questions
Run with: python -m app.seed_data
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Base
from app.models.quiz import QuizQuestion

QUIZ_QUESTIONS = [
    # Personality Section
    {
        "section": "personality",
        "question_text": "How do you prefer to work?",
        "question_type": "multiple_choice",
        "options": ["Independently", "In a team", "Mix of both", "Leading others"],
        "order": 1
    },
    {
        "section": "personality",
        "question_text": "How would you describe your problem-solving approach?",
        "question_type": "multiple_choice",
        "options": ["Analytical and data-driven", "Creative and innovative", "Practical and hands-on", "Strategic and big-picture"],
        "order": 2
    },
    {
        "section": "personality",
        "question_text": "How comfortable are you with risk-taking?",
        "question_type": "scale",
        "options": ["1", "2", "3", "4", "5"],
        "order": 3
    },
    {
        "section": "personality",
        "question_text": "Do you prefer structured routines or flexibility?",
        "question_type": "multiple_choice",
        "options": ["Highly structured", "Somewhat structured", "Flexible", "Highly flexible"],
        "order": 4
    },
    
    # Skills Section
    {
        "section": "skills",
        "question_text": "Rate your technical/computer skills",
        "question_type": "scale",
        "options": ["1", "2", "3", "4", "5"],
        "order": 5
    },
    {
        "section": "skills",
        "question_text": "Rate your communication skills",
        "question_type": "scale",
        "options": ["1", "2", "3", "4", "5"],
        "order": 6
    },
    {
        "section": "skills",
        "question_text": "Which skills do you excel at?",
        "question_type": "multi_select",
        "options": [
            "Programming/Coding",
            "Data Analysis",
            "Design/Creativity",
            "Writing/Content",
            "Public Speaking",
            "Project Management",
            "Sales/Persuasion",
            "Teaching/Mentoring"
        ],
        "order": 7
    },
    {
        "section": "skills",
        "question_text": "Rate your leadership abilities",
        "question_type": "scale",
        "options": ["1", "2", "3", "4", "5"],
        "order": 8
    },
    
    # Interests Section
    {
        "section": "interests",
        "question_text": "Which areas interest you the most?",
        "question_type": "multi_select",
        "options": [
            "Technology & Software",
            "Healthcare & Medicine",
            "Business & Finance",
            "Education & Training",
            "Arts & Entertainment",
            "Science & Research",
            "Marketing & Communications",
            "Engineering & Manufacturing"
        ],
        "order": 9
    },
    {
        "section": "interests",
        "question_text": "What type of impact do you want to make?",
        "question_type": "multiple_choice",
        "options": [
            "Help individuals directly",
            "Solve complex problems",
            "Create innovative products",
            "Build sustainable systems",
            "Educate and empower others"
        ],
        "order": 10
    },
    {
        "section": "interests",
        "question_text": "Are you interested in emerging technologies?",
        "question_type": "multiple_choice",
        "options": ["Very interested", "Somewhat interested", "Neutral", "Not interested"],
        "order": 11
    },
    
    # Work Preferences Section
    {
        "section": "work_preferences",
        "question_text": "Preferred work environment?",
        "question_type": "multiple_choice",
        "options": ["Remote", "Office", "Hybrid", "Travel/Field work"],
        "order": 12
    },
    {
        "section": "work_preferences",
        "question_text": "Preferred work hours?",
        "question_type": "multiple_choice",
        "options": ["Traditional 9-5", "Flexible hours", "Night shifts", "Project-based"],
        "order": 13
    },
    {
        "section": "work_preferences",
        "question_text": "How important is work-life balance?",
        "question_type": "scale",
        "options": ["1", "2", "3", "4", "5"],
        "order": 14
    },
    {
        "section": "work_preferences",
        "question_text": "Preferred company size?",
        "question_type": "multiple_choice",
        "options": ["Startup (1-50)", "Small (51-200)", "Medium (201-1000)", "Large (1000+)", "No preference"],
        "order": 15
    },
    {
        "section": "work_preferences",
        "question_text": "How important is salary vs. job satisfaction?",
        "question_type": "multiple_choice",
        "options": [
            "Salary is primary concern",
            "Prefer higher salary",
            "Equal importance",
            "Prefer job satisfaction",
            "Job satisfaction is primary concern"
        ],
        "order": 16
    },
    
    # Computer Science / IT / Software Engineering Specific Questions
    {
        "section": "technical_skills",
        "field_of_study": "Computer Science",
        "question_text": "Which programming paradigm do you prefer?",
        "question_type": "multiple_choice",
        "options": ["Object-Oriented", "Functional", "Procedural", "No preference", "Still learning"],
        "order": 17
    },
    {
        "section": "technical_skills",
        "field_of_study": "Computer Science",
        "question_text": "What type of development interests you most?",
        "question_type": "multi_select",
        "options": [
            "Frontend/UI Development",
            "Backend/Server Development",
            "Mobile App Development",
            "Game Development",
            "Machine Learning/AI",
            "Cloud/DevOps",
            "Database Management",
            "Cybersecurity"
        ],
        "order": 18
    },
    {
        "section": "technical_skills",
        "field_of_study": "Information Technology",
        "question_text": "Which IT areas interest you?",
        "question_type": "multi_select",
        "options": [
            "Network Administration",
            "System Administration",
            "Cloud Infrastructure",
            "IT Security",
            "Database Administration",
            "Technical Support",
            "IT Project Management"
        ],
        "order": 19
    },
    {
        "section": "technical_skills",
        "field_of_study": "Data Science",
        "question_text": "Which data science areas excite you?",
        "question_type": "multi_select",
        "options": [
            "Machine Learning",
            "Deep Learning/Neural Networks",
            "Natural Language Processing",
            "Computer Vision",
            "Data Visualization",
            "Statistical Analysis",
            "Big Data Processing"
        ],
        "order": 20
    },
    
    # Accounting / Finance Specific Questions
    {
        "section": "accounting_skills",
        "field_of_study": "Accounting",
        "question_text": "Which accounting area interests you most?",
        "question_type": "multi_select",
        "options": [
            "Tax Accounting",
            "Auditing",
            "Forensic Accounting",
            "Management Accounting",
            "Financial Accounting",
            "Bookkeeping",
            "Payroll Management"
        ],
        "order": 21
    },
    {
        "section": "accounting_skills",
        "field_of_study": "Accounting",
        "question_text": "Do you prefer detail-oriented tasks or big-picture analysis?",
        "question_type": "multiple_choice",
        "options": ["Very detail-oriented", "Somewhat detail-oriented", "Balanced", "Big-picture focused"],
        "order": 22
    },
    {
        "section": "finance_skills",
        "field_of_study": "Finance",
        "question_text": "Which finance career paths interest you?",
        "question_type": "multi_select",
        "options": [
            "Investment Banking",
            "Financial Planning",
            "Risk Management",
            "Corporate Finance",
            "Financial Analysis",
            "Portfolio Management",
            "Real Estate Finance"
        ],
        "order": 23
    },
    {
        "section": "business_skills",
        "field_of_study": "Business Administration",
        "question_text": "Which business functions appeal to you?",
        "question_type": "multi_select",
        "options": [
            "Operations Management",
            "Strategic Planning",
            "Business Analysis",
            "Project Management",
            "Supply Chain Management",
            "Quality Management",
            "Business Development"
        ],
        "order": 24
    },
    {
        "section": "business_skills",
        "field_of_study": "BBA",
        "question_text": "What business role excites you most?",
        "question_type": "multiple_choice",
        "options": [
            "Leading teams and projects",
            "Analyzing data and trends",
            "Building client relationships",
            "Developing strategies",
            "Managing operations"
        ],
        "order": 25
    },
    
    # Engineering Specific Questions
    {
        "section": "engineering_skills",
        "field_of_study": "Electrical Engineering",
        "question_text": "Which electrical engineering areas interest you?",
        "question_type": "multi_select",
        "options": [
            "Power Systems",
            "Electronics Design",
            "Control Systems",
            "Signal Processing",
            "Telecommunications",
            "Embedded Systems",
            "Renewable Energy Systems"
        ],
        "order": 26
    },
    {
        "section": "engineering_skills",
        "field_of_study": "Civil Engineering",
        "question_text": "Which civil engineering specializations appeal to you?",
        "question_type": "multi_select",
        "options": [
            "Structural Engineering",
            "Transportation Engineering",
            "Environmental Engineering",
            "Geotechnical Engineering",
            "Water Resources",
            "Construction Management",
            "Urban Planning"
        ],
        "order": 27
    },
    {
        "section": "engineering_skills",
        "field_of_study": "Mechanical Engineering",
        "question_text": "What mechanical engineering areas interest you?",
        "question_type": "multi_select",
        "options": [
            "Automotive Engineering",
            "Aerospace Engineering",
            "Robotics",
            "HVAC Systems",
            "Manufacturing",
            "Energy Systems",
            "Product Design"
        ],
        "order": 28
    },
    {
        "section": "engineering_skills",
        "field_of_study": "Chemical Engineering",
        "question_text": "Which chemical engineering fields interest you?",
        "question_type": "multi_select",
        "options": [
            "Process Engineering",
            "Pharmaceutical Manufacturing",
            "Petrochemical Industry",
            "Environmental Engineering",
            "Materials Science",
            "Food Processing",
            "Biotechnology"
        ],
        "order": 29
    },
    
    # Social Sciences Specific Questions
    {
        "section": "social_science_skills",
        "field_of_study": "International Relations",
        "question_text": "Which IR career paths interest you?",
        "question_type": "multi_select",
        "options": [
            "Diplomacy/Foreign Service",
            "International Development",
            "Global Policy Analysis",
            "International NGOs",
            "Intelligence Analysis",
            "International Trade",
            "Conflict Resolution"
        ],
        "order": 30
    },
    {
        "section": "social_science_skills",
        "field_of_study": "Political Science",
        "question_text": "What political science careers interest you?",
        "question_type": "multi_select",
        "options": [
            "Policy Analysis",
            "Political Consulting",
            "Government Relations",
            "Campaign Management",
            "Public Administration",
            "Legislative Affairs",
            "Political Research"
        ],
        "order": 31
    },
    {
        "section": "analytical_skills",
        "field_of_study": "Economics",
        "question_text": "Which economics career paths appeal to you?",
        "question_type": "multi_select",
        "options": [
            "Economic Research",
            "Data Analysis",
            "Policy Economics",
            "Financial Economics",
            "International Economics",
            "Econometrics",
            "Economic Consulting"
        ],
        "order": 32
    },
    
    # Business/Marketing Specific Questions
    {
        "section": "marketing_skills",
        "field_of_study": "Marketing",
        "question_text": "Which marketing specializations interest you?",
        "question_type": "multi_select",
        "options": [
            "Digital Marketing",
            "Brand Management",
            "Market Research",
            "Content Marketing",
            "Social Media Marketing",
            "Product Marketing",
            "Marketing Analytics"
        ],
        "order": 33
    },
    {
        "section": "hr_skills",
        "field_of_study": "Human Resources",
        "question_text": "Which HR areas appeal to you?",
        "question_type": "multi_select",
        "options": [
            "Talent Acquisition/Recruiting",
            "Employee Relations",
            "Training & Development",
            "Compensation & Benefits",
            "HR Analytics",
            "Organizational Development",
            "HR Technology"
        ],
        "order": 34
    },
    
    # Science Specific Questions
    {
        "section": "science_skills",
        "field_of_study": "Mathematics",
        "question_text": "Which mathematical career paths interest you?",
        "question_type": "multi_select",
        "options": [
            "Actuarial Science",
            "Data Science",
            "Quantitative Analysis",
            "Operations Research",
            "Statistical Analysis",
            "Mathematics Education",
            "Applied Mathematics"
        ],
        "order": 35
    },
    {
        "section": "science_skills",
        "field_of_study": "Physics",
        "question_text": "Which physics specializations interest you?",
        "question_type": "multi_select",
        "options": [
            "Research Physics",
            "Medical Physics",
            "Engineering Physics",
            "Computational Physics",
            "Astrophysics",
            "Applied Physics",
            "Physics Education"
        ],
        "order": 36
    },
    {
        "section": "psychology_skills",
        "field_of_study": "Psychology",
        "question_text": "Which psychology career paths interest you?",
        "question_type": "multi_select",
        "options": [
            "Clinical Psychology",
            "Counseling",
            "Organizational Psychology",
            "Research Psychology",
            "School Psychology",
            "Forensic Psychology",
            "Sports Psychology"
        ],
        "order": 37
    }
]

def seed_quiz_questions():
    """Seed quiz questions into the database"""
    db = SessionLocal()
    
    try:
        # Check if questions already exist
        existing = db.query(QuizQuestion).first()
        if existing:
            print("Quiz questions already exist.")
            print("To re-seed with new field-specific questions, delete all quiz_questions first.")
            print("Run: DELETE FROM quiz_questions; in your database")
            return
        
        # Create questions
        for question_data in QUIZ_QUESTIONS:
            question = QuizQuestion(**question_data)
            db.add(question)
        
        db.commit()
        print(f"Successfully seeded {len(QUIZ_QUESTIONS)} quiz questions!")
        print("Including:")
        print(f"  - {len([q for q in QUIZ_QUESTIONS if q.get('field_of_study') is None])} general questions")
        print(f"  - {len([q for q in QUIZ_QUESTIONS if q.get('field_of_study') is not None])} field-specific questions")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Seed data
    seed_quiz_questions()
