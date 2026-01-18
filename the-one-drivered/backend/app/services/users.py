"""User service providing basic user management for the DriverEdOS API.

This service uses an in-memory store for demonstration purposes. In a
production system, this would be replaced with persistent storage backed
by a relational database or similar.
"""

from dataclasses import dataclass
from typing import Optional, Dict

from passlib.context import CryptContext


# Password hashing context. We use bcrypt for secure password storage.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@dataclass
class UserInDB:
    username: str
    hashed_password: str
    full_name: str | None = None
    email: str | None = None


class UserService:
    """Service providing user authentication and retrieval."""

    def __init__(self) -> None:
        # In-memory user store. Keys are usernames, values are UserInDB instances.
        self._users: Dict[str, UserInDB] = {
            "admin": UserInDB(
                username="admin",
                hashed_password=pwd_context.hash("admin"),
                full_name="Administrator",
                email="admin@example.com",
            ),
            "student": UserInDB(
                username="student",
                hashed_password=pwd_context.hash("student"),
                full_name="Test Student",
                email="student@example.com",
            ),
        }

    def get_user(self, username: str) -> Optional[UserInDB]:
        return self._users.get(username)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        user = self.get_user(username)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user