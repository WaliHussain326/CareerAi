# Setup Guide - AI Career Counselling Platform

Complete step-by-step guide to get the platform running.

## Prerequisites

### Required Software
- **Docker Desktop** (includes Docker Compose)
  - Windows: [Download](https://www.docker.com/products/docker-desktop)
  - Mac: [Download](https://www.docker.com/products/docker-desktop)
  - Linux: Install Docker Engine + Docker Compose

- **Node.js 18+** or **Bun** (for frontend)
  - Node.js: [Download](https://nodejs.org/)
  - Bun: [Download](https://bun.sh/)

- **Google Gemini API Key**
  - Get yours at: [Google AI Studio](https://makersuite.google.com/app/apikey)

### Optional (for local development)
- Python 3.11+
- PostgreSQL 15+
- Git

## Part 1: Backend Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file (use notepad, nano, or your preferred editor)
notepad .env  # Windows
# nano .env   # Linux/Mac
```

Required changes in `.env`:
```env
# Keep this as-is for Docker
DATABASE_URL=postgresql://postgres:090078601@db:5432/career_counselling

# MUST CHANGE: Generate a strong secret key
SECRET_KEY=change-this-to-a-strong-random-key-at-least-32-characters-long

# MUST ADD: Your Gemini API key
GEMINI_API_KEY=your-actual-gemini-api-key-here

# Optional: Keep these as-is
ENVIRONMENT=development
DEBUG=True
```

**How to generate a SECRET_KEY:**
```bash
# Option 1: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: Using OpenSSL
openssl rand -hex 32
```

### Step 3: Start Backend with Docker
```bash
docker-compose up --build
```

Wait for these messages:
```
✅ Database is ready
✅ API server started on http://0.0.0.0:8000
```

### Step 4: Seed Quiz Questions
Open a **new terminal** and run:
```bash
cd backend
docker-compose exec api python -m app.seed_data
```

Expected output:
```
Successfully seeded 16 quiz questions!
```

### Step 5: Create Admin User (Optional)
```bash
docker-compose exec api python -m app.create_admin admin@example.com AdminPass123 "Admin User"
```

### Step 6: Verify Backend
Open your browser and visit:
- **API Health**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You should see the Swagger UI with all available endpoints.

## Part 2: Frontend Setup

### Step 1: Navigate to Frontend
Open a **new terminal** and run:
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
# Using Bun (faster)
bun install

# OR using npm
npm install
```

### Step 3: Configure Environment (Optional)
Create a `.env` file in the frontend directory:
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

### Step 4: Start Frontend
```bash
# Using Bun
bun dev

# OR using npm
npm run dev
```

The frontend will start on: **http://localhost:5173**

### Step 5: Verify Frontend
- Open browser to http://localhost:5173
- You should see the landing page
- Try registering a new account

## Quick Start Scripts

We've provided convenience scripts:

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

These scripts will:
1. Check Docker installation
2. Start backend containers
3. Seed quiz questions
4. Display instructions for frontend

## Testing the Complete Flow

### 1. Register a New User
- Visit http://localhost:5173
- Click "Sign Up"
- Register with email and password

### 2. Complete Onboarding
- Fill in personal information
- Education details
- Work experience
- Skills and interests

### 3. Take the Assessment Quiz
- Answer personality questions
- Skills assessment
- Interest evaluation
- Work preferences

### 4. Get AI Recommendations
- Submit the quiz
- Click "Get Career Recommendations"
- Wait for AI analysis (takes 10-30 seconds)

### 5. View Career Details
- Browse your personalized career matches
- Check skill gaps
- View learning roadmaps

## API Testing with curl

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the `access_token` from the response for subsequent requests.

### Get Quiz Questions
```bash
curl -X GET http://localhost:8000/api/v1/quiz/questions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

See [API_TESTING.md](backend/API_TESTING.md) for complete API examples.

## Troubleshooting

### Backend Issues

#### Port 8000 Already in Use
```bash
# Stop the container
docker-compose down

# Change port in docker-compose.yml
# Change "8000:8000" to "8001:8000" under api service

# Restart
docker-compose up
```

#### Database Connection Error
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart containers
docker-compose restart
```

#### Gemini API Errors
- Verify your API key is correct in `.env`
- Check your Google Cloud quota
- Ensure no spaces around the API key

### Frontend Issues

#### Port 5173 Already in Use
Kill the process or use a different port:
```bash
# Edit vite.config.ts, add:
server: {
  port: 3000
}
```

#### API Connection Failed
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Look for CORS errors in browser console

### Docker Issues

#### Docker Daemon Not Running
- Start Docker Desktop
- Wait for Docker to fully start

#### Permission Denied (Linux)
```bash
sudo usermod -aG docker $USER
# Logout and login again
```

## Development Tips

### View Backend Logs
```bash
docker-compose logs -f api
```

### View Database Logs
```bash
docker-compose logs -f db
```

### Access PostgreSQL Database
```bash
docker-compose exec db psql -U postgres -d career_counselling
```

### Stop All Services
```bash
# Backend
docker-compose down

# Frontend
Ctrl+C in the terminal
```

### Restart Backend
```bash
docker-compose restart api
```

### Reset Database (CAUTION: Deletes all data)
```bash
docker-compose down -v
docker-compose up --build
docker-compose exec api python -m app.seed_data
```

## Production Deployment

For production deployment:

1. **Environment Variables**
   - Set `ENVIRONMENT=production`
   - Set `DEBUG=False`
   - Use strong `SECRET_KEY`
   - Use managed PostgreSQL database
   - Enable HTTPS

2. **Database**
   - Use AWS RDS, Azure Database, or similar
   - Enable SSL connections
   - Set up automated backups
   - Use connection pooling

3. **Application**
   - Use production WSGI server (gunicorn)
   - Set up reverse proxy (nginx)
   - Enable SSL/TLS
   - Configure CORS properly
   - Set up monitoring and logging

4. **Frontend**
   - Build production bundle: `npm run build`
   - Deploy to CDN or static hosting
   - Configure API URL
   - Enable caching

## Next Steps

1. **Customize Quiz Questions**
   - Login as admin
   - Navigate to admin panel
   - Add/edit quiz questions

2. **Integrate with Frontend**
   - Update API calls in frontend
   - Add authentication context
   - Implement error handling

3. **Enhance AI Prompts**
   - Edit `backend/app/services/gemini_service.py`
   - Customize recommendation logic
   - Add more career categories

4. **Add Features**
   - Email verification
   - Password reset
   - User profiles
   - Career comparison
   - Progress tracking

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables
3. Review API documentation at `/docs`
4. Check database connection

## Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **SQLAlchemy Documentation**: https://docs.sqlalchemy.org/
- **Google Gemini API**: https://ai.google.dev/docs
- **Docker Documentation**: https://docs.docker.com/
- **React Documentation**: https://react.dev/

---

**You're all set! Happy coding! 🚀**
