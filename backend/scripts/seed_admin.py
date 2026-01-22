from __future__ import annotations

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.database import AsyncSessionLocal
from app.models.enums import Role
from app.models.user import User
from app.core.security import hash_password


async def main():
    username = settings.seed_admin_username
    password = settings.seed_admin_password
    role = Role(settings.seed_admin_role)

    async with AsyncSessionLocal() as db:  # type: ignore
        res = await db.execute(select(User).where(User.username == username))
        existing = res.scalar_one_or_none()
        if existing:
            print(f"Admin user '{username}' already exists. Nothing to do.")
            return

        user = User(username=username, hashed_password=hash_password(password), role=role)
        db.add(user)
        await db.commit()
        print(f"Created admin user '{username}' with role '{role.value}'.")


if __name__ == "__main__":
    asyncio.run(main())
