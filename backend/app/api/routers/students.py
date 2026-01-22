from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.dependencies.auth import require_role
from app.models.enums import Role
from app.schemas.student import StudentCreate, StudentOut, StudentUpdate
from app.crud import student as crud

router = APIRouter()

# Backwards compatible: GET/POST /api/students
@router.get("/", response_model=list[StudentOut])
async def list_students(
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
    limit: int = 200,
    offset: int = 0,
):
    items = await crud.list_students(db, limit=limit, offset=offset)
    return [StudentOut(**s.__dict__) for s in items]


@router.post("/", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
async def create_student(
    payload: StudentCreate,
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
):
    st = await crud.create_student(db, payload)
    return StudentOut(**st.__dict__)


# New endpoints without breaking old:
@router.get("/{student_id}", response_model=StudentOut)
async def get_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
):
    st = await crud.get_student(db, student_id)
    if not st:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentOut(**st.__dict__)


@router.put("/{student_id}", response_model=StudentOut)
async def update_student(
    student_id: int,
    payload: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
):
    st = await crud.get_student(db, student_id)
    if not st:
        raise HTTPException(status_code=404, detail="Student not found")
    st = await crud.update_student(db, st, payload)
    return StudentOut(**st.__dict__)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: int,
    db: AsyncSession = Depends(get_db),
    _user = Depends(require_role(Role.admin, Role.instructor)),
):
    st = await crud.get_student(db, student_id)
    if not st:
        raise HTTPException(status_code=404, detail="Student not found")
    await crud.delete_student(db, st)
    return None
