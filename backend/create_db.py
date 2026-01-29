"""
Create the career_counselling database
Run with: python create_db.py
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to default postgres database
conn = psycopg2.connect(
    host="localhost",
    user="postgres",
    password="090078601",
    database="postgres"  # Connect to default postgres db
)

# Set autocommit mode
conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

# Create database
cursor = conn.cursor()
try:
    cursor.execute("CREATE DATABASE career_counselling;")
    print("✅ Database 'career_counselling' created successfully!")
except psycopg2.errors.DuplicateDatabase:
    print("ℹ️  Database 'career_counselling' already exists.")
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    cursor.close()
    conn.close()
