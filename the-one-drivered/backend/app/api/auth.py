"""Authentication endpoints for the DriverEdOS API.

This module exposes a simple login endpoint that issues a JWT access
token when provided with valid user credentials. The authentication
model is deliberately minimal to demonstrate how a stateful system might
integrate with a more complex identity provider in future phases.
"""

from datetime import timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from app.core import security
from app.services.users import UserService, UserInDB


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class Token(BaseModel):
    """Schema for an access token response."""

    access_token: str
    token_type: str


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    """Authenticate the user and return a JWT access token.

    This endpoint expects form-encoded credentials via `OAuth2PasswordRequestForm`
    which includes `username` and `password` fields. If the user is
    authenticated successfully, a JWT token is issued using the configured
    secret key and returned to the caller.
    """
    user_service = UserService()
    user: Optional[UserInDB] = user_service.authenticate_user(
        form_data.username, form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create a token valid for 30 minutes
    access_token_expires = timedelta(minutes=30)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")