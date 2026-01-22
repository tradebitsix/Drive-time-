from __future__ import annotations

from pydantic import BaseModel, Field
from app.models.enums import StudentStatus

class StudentBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    status: StudentStatus = StudentStatus.enrolled
    progress_hours: float = Field(default=0.0, ge=0.0)
    notes: str | None = None

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    status: StudentStatus | None = None
    progress_hours: float | None = Field(default=None, ge=0.0)
    notes: str | None = None

class StudentOut(StudentBase):
    id: int
