from fastapi import APIRouter
from app.api.v1.endpoints import auth, onboarding, quiz, careers, admin

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(onboarding.router)
api_router.include_router(quiz.router)
api_router.include_router(careers.router)
api_router.include_router(admin.router)
