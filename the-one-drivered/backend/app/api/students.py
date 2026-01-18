"""Endpoints for managing student resources.

This module exposes CRUD operations for student entities. For this
demonstration, students are stored in memory. In a real system these
would be persisted to a database and operations would be scoped by
tenant and state.
"""

from typing import List

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from app.core import security
from app.api.auth import oauth2_scheme


router = APIRouter()


class StudentBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    state: str = Field(..., description="Two-letter state code (e.g. ID, MT, WY)")


class StudentCreate(StudentBase):
    pass


class Student(StudentBase):
    id: int

    class Config:
        orm_mode = True


# In-memory student store
students_store: List[Student] = []


def get_current_username(token: str = Depends(oauth2_scheme)) -> str:
    """Dependency to extract the username from a JWT token."""
    # In a full implementation you'd verify and decode the token here.
    # For this demonstration we trust the token payload.
    from jose import JWTError, jwt
    from app.core.config import settings

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception


@router.get("/", response_model=List[Student])
async def list_students(current_user: str = Depends(get_current_username)) -> List[Student]:
    """Return all students. Authentication required."""
    return students_store


@router.post("/", response_model=Student, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_in: StudentCreate, current_user: str = Depends(get_current_username)
) -> Student:
    """Create a new student and add to the store."""
    new_id = len(students_store) + 1
    student = Student(id=new_id, **student_in.dict())
    students_store.append(student)
    return student