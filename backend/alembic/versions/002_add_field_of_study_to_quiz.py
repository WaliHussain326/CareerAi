"""add field_of_study to quiz_questions

Revision ID: 002
Revises: 001
Create Date: 2026-01-29

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade():
    # Add field_of_study column to quiz_questions table
    op.add_column('quiz_questions', sa.Column('field_of_study', sa.String(), nullable=True))


def downgrade():
    # Remove field_of_study column from quiz_questions table
    op.drop_column('quiz_questions', 'field_of_study')
