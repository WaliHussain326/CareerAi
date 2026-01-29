# AI-Based Future Counselling Platform

A full-stack application for AI-powered career counselling and personalized career recommendations.

## Project Structure

```
dream-app-builder/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/           # FastAPI Python backend
│   ├── app/
│   ├── alembic/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Backend Setup

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

Quick start:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
docker-compose up --build
```

Backend will be available at: http://localhost:8000

### Frontend Setup

```bash
cd frontend
bun install  # or npm install
bun dev      # or npm run dev
```

Frontend will be available at: http://localhost:5173

## Features

### For Users
- 🔐 Secure authentication with JWT
- 📝 Guided onboarding process
- 🎯 Interactive career assessment quiz
- 🤖 AI-powered career recommendations using Google Gemini
- 📊 Personalized skill gap analysis
- 🗺️ Custom learning roadmaps
- 📈 Progress tracking

### For Admins
- 👥 User management
- ❓ Quiz question management
- 📊 Platform analytics
- 🎯 Career path oversight

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Shadcn UI

### Backend
- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy 2.0
- Alembic
- JWT Authentication
- Google Gemini AI
- Docker

## API Documentation

Once the backend is running, access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Workflow

1. Start backend:
   ```bash
   cd backend
   docker-compose up
   ```

2. Start frontend:
   ```bash
   cd frontend
   bun dev
   ```

3. Access:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:090078601@db:5432/career_counselling
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📚 Documentation

Comprehensive documentation is available:

- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions ⭐ START HERE
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's been built
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture diagrams
- **[backend/README.md](backend/README.md)** - Backend documentation
- **[backend/API_TESTING.md](backend/API_TESTING.md)** - API testing guide
- **[frontend/README.md](frontend/README.md)** - Frontend documentation

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete step-by-step instructions.

## 📊 Project Status

- ✅ **Backend**: Complete and production-ready
- ✅ **Database**: PostgreSQL schema implemented
- ✅ **API**: 26 endpoints fully functional
- ✅ **Authentication**: JWT-based auth working
- ✅ **AI Integration**: Google Gemini connected
- ✅ **Docker**: Full containerization ready
- ✅ **Documentation**: Comprehensive guides included

## License

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
