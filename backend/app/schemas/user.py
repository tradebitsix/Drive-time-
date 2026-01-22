from __future__ import annotations

from pydantic import BaseModel, Field
from app.models.enums import Role

class UserPublic(BaseModel):
    id: int
    username: str
    role: Role

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    role: Role

class UserUpdateRole(BaseModel):
    role: Role
