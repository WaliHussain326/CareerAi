# AI-Based Future Counselling Platform - Backend

A production-ready FastAPI backend for AI-powered career counselling and recommendations.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchic 2.0
- **Migrations**: Alembic
- **Authentication**: JWT (Access + Refresh tokens)
- **AI**: Google Gemini API
- **Containerization**: Docker + Docker Compose

## Features

### ✅ Authentication & Users
- User registration with email validation
- Secure login with JWT tokens
- Access + Refresh token system
- Password hashing with bcrypt
- Role-based access (user/admin)

### ✅ Onboarding System
- Multi-step onboarding process
- Profile completion tracking (0-100%)
- Personal, education, experience, and skills data
- Resume capability for incomplete onboarding

### ✅ Career Assessment Quiz
- Configurable quiz sections (personality, skills, interests, work preferences)
- Multiple question types (multiple choice, scale, multi-select, text)
- Incremental answer saving
- Progress tracking
- Resume quiz support
- Quiz completion validation

### ✅ AI Career Recommendations
- Google Gemini-powered career matching
- Personalized career recommendations (top 5)
- Match scoring (0-100)
- Detailed career descriptions
- Required skills analysis
- Growth potential assessment
- Salary range information

### ✅ Skill Gap Analysis
- Identify missing skills for target careers
- Current vs required skill levels
- Priority ranking (high/medium/low)
- Time estimates for skill acquisition

### ✅ Learning Roadmaps
- Phased learning plans
- Specific learning objectives
- Curated resources (courses, books, certifications)
- Duration estimates for each phase

### ✅ Admin Panel
- Manage quiz questions (CRUD)
- Platform analytics
- User management
- Career path oversight

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- PostgreSQL 15+ (if running locally)

### 1. Clone and Setup

```bash
cd backend
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
DATABASE_URL=postgresql://postgres:090078601@db:5432/career_counselling
SECRET_KEY=your-super-secret-key-change-this-min-32-characters
GEMINI_API_KEY=your-google-gemini-api-key
```

**Important**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Start with Docker Compose

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Start FastAPI application
- Run on http://localhost:8000

### 4. Seed Quiz Questions

In a new terminal:

```bash
docker-compose exec api python -m app.seed_data
```

### 5. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Local Development (Without Docker)

### 1. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Database

Ensure PostgreSQL is running, then create database:

```sql
CREATE DATABASE career_counselling;
```

### 4. Run Migrations

```bash
alembic upgrade head
```

### 5. Seed Data

```bash
python -m app.seed_data
```

### 6. Run Development Server

```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Onboarding
- `POST /api/v1/onboarding` - Create/update onboarding data
- `PUT /api/v1/onboarding` - Update onboarding data
- `GET /api/v1/onboarding` - Get onboarding data
- `GET /api/v1/onboarding/completeness` - Get profile completeness

### Quiz
- `GET /api/v1/quiz/questions` - Get quiz questions
- `POST /api/v1/quiz/answers` - Save quiz answer
- `GET /api/v1/quiz/answers` - Get user's answers
- `GET /api/v1/quiz/progress` - Get quiz progress
- `POST /api/v1/quiz/submit` - Submit completed quiz
- `GET /api/v1/quiz/submission` - Get submission status

### Career Recommendations
- `POST /api/v1/careers/generate` - Generate AI recommendations
- `GET /api/v1/careers` - Get all recommendations
- `GET /api/v1/careers/{id}` - Get career details
- `GET /api/v1/careers/{id}/skill-gaps` - Get skill gaps
- `GET /api/v1/careers/{id}/roadmap` - Get learning roadmap

### Admin (Requires admin role)
- `GET /api/v1/admin/analytics` - Platform analytics
- `GET /api/v1/admin/quiz-questions` - All quiz questions
- `POST /api/v1/admin/quiz-questions` - Create question
- `PUT /api/v1/admin/quiz-questions/{id}` - Update question
- `DELETE /api/v1/admin/quiz-questions/{id}` - Delete question
- `GET /api/v1/admin/users` - Get all users

## Database Schema

### Users
- Email, password (hashed), full name
- Role (user/admin)
- Active status

### Onboarding Data
- Personal info (age, gender, location)
- Education (level, field, institution)
- Experience (years, role, industry)
- Skills (technical, soft)
- Interests and career goals
- Completion tracking

### Quiz
- **Questions**: Section, text, type, options
- **Answers**: User responses
- **Submissions**: Progress and completion status

### Career Recommendations
- Career details (title, description, match score)
- Required skills
- Growth potential, salary range
- AI analysis data

### Skill Gaps
- Skill name, current/required levels
- Priority and time estimates

### Learning Roadmaps
- Phases with objectives
- Resources and durations

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User"
  }'
```

### 2. Complete Onboarding

Use the access token from registration:

```bash
curl -X POST http://localhost:8000/api/v1/onboarding \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "education_level": "Bachelor",
    "field_of_study": "Computer Science",
    "technical_skills": ["Python", "JavaScript"],
    "interests": ["Technology", "AI"]
  }'
```

### 3. Take Quiz

Get questions and submit answers, then:

```bash
curl -X POST http://localhost:8000/api/v1/quiz/submit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Generate Career Recommendations

```bash
curl -X POST http://localhost:8000/api/v1/careers/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Alembic Migrations

### Create Migration

```bash
alembic revision --autogenerate -m "Description"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback

```bash
alembic downgrade -1
```

## Security Features

✅ Password hashing with bcrypt  
✅ JWT access tokens (30 min expiry)  
✅ JWT refresh tokens (7 day expiry)  
✅ Token validation on protected routes  
✅ Role-based access control  
✅ SQL injection protection (SQLAlchemy)  
✅ CORS configuration  
✅ Environment variable security  

## Production Deployment

### Environment Variables

Ensure these are set in production:

```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<strong-random-key>
DATABASE_URL=<production-db-url>
GEMINI_API_KEY=<your-key>
```

### Database

- Use managed PostgreSQL (AWS RDS, Azure, etc.)
- Enable SSL connections
- Regular backups
- Connection pooling

### Application

- Use gunicorn or similar WSGI server
- Set up reverse proxy (nginx)
- Enable HTTPS
- Configure logging
- Set up monitoring

## Project Structure

```
backend/
├── alembic/                 # Database migrations
│   ├── env.py
│   └── versions/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/   # API route handlers
│   │       │   ├── auth.py
│   │       │   ├── onboarding.py
│   │       │   ├── quiz.py
│   │       │   ├── careers.py
│   │       │   └── admin.py
│   │       └── router.py
│   ├── core/                # Core configuration
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   └── dependencies.py
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── onboarding.py
│   │   ├── quiz.py
│   │   └── career.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user.py
│   │   ├── onboarding.py
│   │   ├── quiz.py
│   │   └── career.py
│   ├── services/            # Business logic
│   │   ├── auth_service.py
│   │   ├── onboarding_service.py
│   │   ├── quiz_service.py
│   │   └── gemini_service.py
│   ├── main.py              # FastAPI app
│   └── seed_data.py         # Database seeding
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── alembic.ini
└── .env.example
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs api
```

### Migration Issues

```bash
# Reset database (CAUTION: Deletes all data)
docker-compose down -v
docker-compose up --build
```

### Gemini API Errors

- Verify API key is correct
- Check API quota/limits
- Review error logs for specific issues

## Support

For issues or questions:
1. Check API documentation at `/docs`
2. Review error logs
3. Verify environment configuration

## License

MIT License - see LICENSE file for details
