"""
Reset and reseed quiz questions with field-specific questions
Run with: python -m app.reset_quiz_questions
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Base
from app.models.quiz import QuizQuestion, QuizAnswer, QuizSubmission
from app.seed_data import QUIZ_QUESTIONS

def reset_and_reseed():
    """Delete all quiz questions and reseed with new field-specific questions"""
    db = SessionLocal()
    
    try:
        print("⚠️  WARNING: This will delete ALL quiz questions, answers, and submissions!")
        response = input("Are you sure you want to continue? (yes/no): ")
        
        if response.lower() != 'yes':
            print("Operation cancelled.")
            return
        
        # Delete all quiz data
        print("\n🗑️  Deleting quiz submissions...")
        db.query(QuizSubmission).delete()
        
        print("🗑️  Deleting quiz answers...")
        db.query(QuizAnswer).delete()
        
        print("🗑️  Deleting quiz questions...")
        db.query(QuizQuestion).delete()
        
        db.commit()
        print("✅ All quiz data deleted successfully!")
        
        # Reseed questions
        print("\n📝 Seeding new field-specific questions...")
        for question_data in QUIZ_QUESTIONS:
            question = QuizQuestion(**question_data)
            db.add(question)
        
        db.commit()
        
        # Count questions by field
        general_count = len([q for q in QUIZ_QUESTIONS if q.get('field_of_study') is None])
        field_specific_count = len([q for q in QUIZ_QUESTIONS if q.get('field_of_study') is not None])
        
        print(f"\n✅ Successfully seeded {len(QUIZ_QUESTIONS)} quiz questions!")
        print(f"   📋 General questions (all fields): {general_count}")
        print(f"   🎯 Field-specific questions: {field_specific_count}")
        
        # Show breakdown by field
        print("\n📊 Breakdown by field:")
        fields = {}
        for q in QUIZ_QUESTIONS:
            field = q.get('field_of_study', 'General (All Fields)')
            fields[field] = fields.get(field, 0) + 1
        
        for field, count in sorted(fields.items()):
            print(f"   • {field}: {count} questions")
        
        print("\n✨ Quiz system is ready with field-specific questions!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Reset and reseed
    reset_and_reseed()
