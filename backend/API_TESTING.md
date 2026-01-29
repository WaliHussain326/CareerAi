# API Testing Guide

This document provides example API calls for testing the backend.

## Base URL
```
http://localhost:8000/api/v1
```

## 1. Authentication

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "full_name": "Test User"
  }'
```

Response:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Test User",
    "role": "user",
    "is_active": true,
    "created_at": "2026-01-27T..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 2. Onboarding

### Create/Update Onboarding Data
```bash
curl -X POST http://localhost:8000/api/v1/onboarding \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "gender": "Male",
    "location": "New York, USA",
    "education_level": "Bachelor",
    "field_of_study": "Computer Science",
    "institution": "MIT",
    "graduation_year": 2023,
    "years_of_experience": 2,
    "current_role": "Junior Developer",
    "industry": "Technology",
    "technical_skills": ["Python", "JavaScript", "React", "SQL"],
    "soft_skills": ["Communication", "Teamwork", "Problem Solving"],
    "interests": ["AI", "Machine Learning", "Web Development"],
    "career_goals": "Become a Senior Software Engineer specializing in AI",
    "step_completed": 4
  }'
```

### Get Onboarding Data
```bash
curl -X GET http://localhost:8000/api/v1/onboarding \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Profile Completeness
```bash
curl -X GET http://localhost:8000/api/v1/onboarding/completeness \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 3. Quiz

### Get Quiz Questions
```bash
# All questions
curl -X GET http://localhost:8000/api/v1/quiz/questions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by section
curl -X GET "http://localhost:8000/api/v1/quiz/questions?section=personality" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Save Quiz Answer
```bash
curl -X POST http://localhost:8000/api/v1/quiz/answers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_id": 1,
    "answer": "In a team"
  }'
```

### Get User Answers
```bash
curl -X GET http://localhost:8000/api/v1/quiz/answers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Quiz Progress
```bash
curl -X GET http://localhost:8000/api/v1/quiz/progress \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Submit Quiz
```bash
curl -X POST http://localhost:8000/api/v1/quiz/submit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 4. Career Recommendations

### Generate Recommendations (AI)
```bash
curl -X POST http://localhost:8000/api/v1/careers/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "force_regenerate": false
  }'
```

### Get All Recommendations
```bash
curl -X GET http://localhost:8000/api/v1/careers \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Career Detail
```bash
curl -X GET http://localhost:8000/api/v1/careers/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Skill Gaps
```bash
curl -X GET http://localhost:8000/api/v1/careers/1/skill-gaps \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Learning Roadmap
```bash
curl -X GET http://localhost:8000/api/v1/careers/1/roadmap \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 5. Admin Endpoints

### Get Analytics
```bash
curl -X GET http://localhost:8000/api/v1/admin/analytics \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### Get All Quiz Questions (Admin)
```bash
curl -X GET http://localhost:8000/api/v1/admin/quiz-questions \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### Create Quiz Question
```bash
curl -X POST http://localhost:8000/api/v1/admin/quiz-questions \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "section": "personality",
    "question_text": "What motivates you most at work?",
    "question_type": "multiple_choice",
    "options": ["Recognition", "Learning", "Impact", "Compensation"],
    "order": 20
  }'
```

### Update Quiz Question
```bash
curl -X PUT http://localhost:8000/api/v1/admin/quiz-questions/1 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question_text": "Updated question text",
    "is_active": true
  }'
```

### Delete Quiz Question
```bash
curl -X DELETE http://localhost:8000/api/v1/admin/quiz-questions/1 \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### Get All Users (Admin)
```bash
curl -X GET http://localhost:8000/api/v1/admin/users \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## Complete User Flow Example

### 1. Register
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","full_name":"Test User"}' \
  | jq -r '.access_token')
```

### 2. Complete Onboarding
```bash
curl -X POST http://localhost:8000/api/v1/onboarding \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "education_level": "Bachelor",
    "field_of_study": "Computer Science",
    "technical_skills": ["Python", "Java"],
    "interests": ["AI", "Data Science"],
    "step_completed": 4
  }'
```

### 3. Take Quiz (answer multiple questions)
```bash
# Answer question 1
curl -X POST http://localhost:8000/api/v1/quiz/answers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question_id": 1, "answer": "In a team"}'

# Continue answering more questions...
```

### 4. Submit Quiz
```bash
curl -X POST http://localhost:8000/api/v1/quiz/submit \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Generate Career Recommendations
```bash
curl -X POST http://localhost:8000/api/v1/careers/generate \
  -H "Authorization: Bearer $TOKEN"
```

### 6. View Recommendations
```bash
curl -X GET http://localhost:8000/api/v1/careers \
  -H "Authorization: Bearer $TOKEN"
```

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## Notes

- All authenticated endpoints require the `Authorization: Bearer TOKEN` header
- Tokens expire after 30 minutes (configurable)
- Admin endpoints require a user with `role="admin"`
- The API uses PostgreSQL for data persistence
- Quiz must be 70% completed before submission
- AI recommendations require both onboarding and quiz completion
