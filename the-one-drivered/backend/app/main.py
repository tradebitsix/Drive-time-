from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, students


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(title="The One Driver Ed API")

    # CORS settings – in development we allow all origins. In production,
    # this should be restricted to known frontend domains.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(students.router, prefix="/api/students", tags=["students"])

    @app.get("/api/health")
    def health() -> dict[str, str]:
        """Simple health check endpoint."""
        return {"status": "ok"}

    return app


app = create_app()