from __future__ import annotations

from sqlalchemy import String, Float, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base
from app.models.enums import StudentStatus


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), index=True, nullable=False)
    status: Mapped[StudentStatus] = mapped_column(SAEnum(StudentStatus, name="student_status_enum"), default=StudentStatus.enrolled, nullable=False)
    progress_hours: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
