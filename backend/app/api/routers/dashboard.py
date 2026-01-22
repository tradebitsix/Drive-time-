from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.dependencies.auth import require_role
from app.models.enums import Role
from app.schemas.dashboard import DashboardStats
from app.crud.student import dashboard_stats

router = APIRouter()

@router.get("/dashboard-stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
):
    data = await dashboard_stats(db)
    return DashboardStats(**data)
