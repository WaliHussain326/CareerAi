@echo off
REM AI Career Counselling Platform - Quick Start Script (Windows)

echo ========================================
echo AI Career Counselling Platform - Quick Start
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env and add your GEMINI_API_KEY
    echo Get your key from: https://makersuite.google.com/app/apikey
    echo.
    pause
)

echo Starting Docker containers...
docker-compose up -d --build

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo Seeding quiz questions...
docker-compose exec -T api python -m app.seed_data

echo.
echo ========================================
echo Backend is ready!
echo    API: http://localhost:8000
echo    Docs: http://localhost:8000/docs
echo.
echo To start the frontend:
echo    cd frontend
echo    bun install
echo    bun dev
echo.
echo Happy coding!
echo ========================================
pause
