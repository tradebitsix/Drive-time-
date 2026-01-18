"""Utility functions for security-related operations such as JWT creation.
"""

from datetime import datetime, timedelta
from typing import Any, Optional

from jose import jwt

from app.core.config import settings


def create_access_token(data: dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT.

    :param data: The payload to include in the token. Must be JSON serializable.
    :param expires_delta: How long the token should be valid. If omitted,
        defaults to the configured expiration window.
    :return: Encoded JWT as a string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt