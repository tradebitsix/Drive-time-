from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.dependencies.auth import require_role
from app.models.enums import Role
from app.schemas.user import UserPublic, UserCreate, UserUpdateRole
from app.crud import user as crud

router = APIRouter()

@router.get("/", response_model=list[UserPublic])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_role(Role.admin)),
):
    users = await crud.list_users(db)
    return [UserPublic(id=u.id, username=u.username, role=u.role) for u in users]


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(
    payload: UserCreate,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_role(Role.admin)),
):
    existing = await crud.get_by_username(db, payload.username)
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")
    u = await crud.create_user(db, username=payload.username, password=payload.password, role=payload.role)
    return UserPublic(id=u.id, username=u.username, role=u.role)


@router.put("/{user_id}/role", response_model=UserPublic)
async def update_user_role(
    user_id: int,
    payload: UserUpdateRole,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_role(Role.admin)),
):
    u = await crud.get_by_id(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    u = await crud.update_user_role(db, u, payload.role)
    return UserPublic(id=u.id, username=u.username, role=u.role)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin = Depends(require_role(Role.admin)),
):
    u = await crud.get_by_id(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    await crud.delete_user(db, u)
    return None
