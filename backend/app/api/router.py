from fastapi import APIRouter

from app.api.routers import health, auth, students, dashboard, users

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(dashboard.router, tags=["dashboard"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
