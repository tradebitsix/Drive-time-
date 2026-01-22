from __future__ import annotations

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.student import Student
from app.models.enums import StudentStatus
from app.schemas.student import StudentCreate, StudentUpdate


async def list_students(db: AsyncSession, *, limit: int = 200, offset: int = 0) -> list[Student]:
    res = await db.execute(select(Student).order_by(Student.id.desc()).limit(limit).offset(offset))
    return list(res.scalars().all())


async def get_student(db: AsyncSession, student_id: int) -> Student | None:
    res = await db.execute(select(Student).where(Student.id == student_id))
    return res.scalar_one_or_none()


async def create_student(db: AsyncSession, data: StudentCreate) -> Student:
    st = Student(**data.model_dump())
    db.add(st)
    await db.commit()
    await db.refresh(st)
    return st


async def update_student(db: AsyncSession, student: Student, data: StudentUpdate) -> Student:
    payload = data.model_dump(exclude_unset=True)
    for k, v in payload.items():
        setattr(student, k, v)
    await db.commit()
    await db.refresh(student)
    return student


async def delete_student(db: AsyncSession, student: Student) -> None:
    await db.delete(student)
    await db.commit()


async def dashboard_stats(db: AsyncSession) -> dict[str, int]:
    total = (await db.execute(select(func.count(Student.id)))).scalar_one()
    active = (await db.execute(select(func.count(Student.id)).where(Student.status == StudentStatus.active))).scalar_one()
    completed = (await db.execute(select(func.count(Student.id)).where(Student.status == StudentStatus.completed))).scalar_one()
    return {"total": int(total), "active": int(active), "completed": int(completed)}
