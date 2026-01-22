from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password, create_access_token
from app.db.database import get_db
from app.crud.user import get_by_username
from app.schemas.token import Token
from app.schemas.user import UserPublic
from app.dependencies.auth import get_current_user
from app.core.limiter import limiter

router = APIRouter()

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    user = await get_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    token = create_access_token(subject=user.username, role=user.role.value)
    return Token(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserPublic)
async def me(current_user = Depends(get_current_user)):
    return UserPublic(id=current_user.id, username=current_user.username, role=current_user.role)
