"""Application configuration.

This module centralizes configuration values for the application. In a
real system these values could be loaded from environment variables or
configuration files, but for this demonstration we define sane
defaults here.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Cryptographic key used to sign JWT tokens. In production this should
    # be a long, random string stored securely outside of source control.
    secret_key: str = "CHANGE_ME_TO_A_LONG_RANDOM_STRING"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30


settings = Settings()