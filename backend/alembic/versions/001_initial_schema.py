"""Initial database schema

Revision ID: 001
Revises: 
Create Date: 2026-01-27 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('role', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    
    # Create onboarding_data table
    op.create_table('onboarding_data',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=True),
        sa.Column('gender', sa.String(), nullable=True),
        sa.Column('location', sa.String(), nullable=True),
        sa.Column('education_level', sa.String(), nullable=True),
        sa.Column('field_of_study', sa.String(), nullable=True),
        sa.Column('institution', sa.String(), nullable=True),
        sa.Column('graduation_year', sa.Integer(), nullable=True),
        sa.Column('years_of_experience', sa.Integer(), nullable=True),
        sa.Column('current_role', sa.String(), nullable=True),
        sa.Column('industry', sa.String(), nullable=True),
        sa.Column('technical_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('soft_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('interests', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('career_goals', sa.String(), nullable=True),
        sa.Column('step_completed', sa.Integer(), nullable=True),
        sa.Column('is_completed', sa.Boolean(), nullable=True),
        sa.Column('profile_completeness', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_onboarding_data_id'), 'onboarding_data', ['id'], unique=False)
    
    # Create quiz_questions table
    op.create_table('quiz_questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('section', sa.String(), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('question_type', sa.String(), nullable=False),
        sa.Column('options', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_questions_id'), 'quiz_questions', ['id'], unique=False)
    
    # Create quiz_submissions table
    op.create_table('quiz_submissions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('is_completed', sa.Boolean(), nullable=True),
        sa.Column('completed_sections', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('total_questions', sa.Integer(), nullable=True),
        sa.Column('answered_questions', sa.Integer(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_submissions_id'), 'quiz_submissions', ['id'], unique=False)
    
    # Create quiz_answers table
    op.create_table('quiz_answers',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('answer', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['quiz_questions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_answers_id'), 'quiz_answers', ['id'], unique=False)
    
    # Create career_recommendations table
    op.create_table('career_recommendations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('career_title', sa.String(), nullable=False),
        sa.Column('career_description', sa.Text(), nullable=True),
        sa.Column('match_score', sa.Float(), nullable=True),
        sa.Column('reasoning', sa.Text(), nullable=True),
        sa.Column('required_skills', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('growth_potential', sa.String(), nullable=True),
        sa.Column('salary_range', sa.String(), nullable=True),
        sa.Column('work_environment', sa.String(), nullable=True),
        sa.Column('ai_analysis', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_career_recommendations_id'), 'career_recommendations', ['id'], unique=False)
    
    # Create skill_gaps table
    op.create_table('skill_gaps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('career_recommendation_id', sa.Integer(), nullable=False),
        sa.Column('skill_name', sa.String(), nullable=False),
        sa.Column('current_level', sa.String(), nullable=True),
        sa.Column('required_level', sa.String(), nullable=True),
        sa.Column('priority', sa.String(), nullable=True),
        sa.Column('estimated_time', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['career_recommendation_id'], ['career_recommendations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_skill_gaps_id'), 'skill_gaps', ['id'], unique=False)
    
    # Create learning_roadmaps table
    op.create_table('learning_roadmaps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('career_recommendation_id', sa.Integer(), nullable=False),
        sa.Column('phase', sa.String(), nullable=False),
        sa.Column('duration', sa.String(), nullable=True),
        sa.Column('objectives', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('resources', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['career_recommendation_id'], ['career_recommendations.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_learning_roadmaps_id'), 'learning_roadmaps', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_learning_roadmaps_id'), table_name='learning_roadmaps')
    op.drop_table('learning_roadmaps')
    op.drop_index(op.f('ix_skill_gaps_id'), table_name='skill_gaps')
    op.drop_table('skill_gaps')
    op.drop_index(op.f('ix_career_recommendations_id'), table_name='career_recommendations')
    op.drop_table('career_recommendations')
    op.drop_index(op.f('ix_quiz_answers_id'), table_name='quiz_answers')
    op.drop_table('quiz_answers')
    op.drop_index(op.f('ix_quiz_submissions_id'), table_name='quiz_submissions')
    op.drop_table('quiz_submissions')
    op.drop_index(op.f('ix_quiz_questions_id'), table_name='quiz_questions')
    op.drop_table('quiz_questions')
    op.drop_index(op.f('ix_onboarding_data_id'), table_name='onboarding_data')
    op.drop_table('onboarding_data')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
