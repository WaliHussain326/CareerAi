#!/bin/bash

# AI Career Counselling Platform - Quick Start Script

echo "🚀 AI Career Counselling Platform - Quick Start"
echo "==============================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
    echo "   Get your key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press enter once you've configured the .env file..."
fi

echo "🐳 Starting Docker containers..."
docker-compose up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🌱 Seeding quiz questions..."
docker-compose exec -T api python -m app.seed_data

echo ""
echo "✅ Backend is ready!"
echo "   API: http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo ""
echo "📚 To start the frontend:"
echo "   cd ../frontend"
echo "   bun install && bun dev"
echo ""
echo "🎉 Happy coding!"
