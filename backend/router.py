"""FastAPI router factory for future dynamic module backend loading."""
from __future__ import annotations

from fastapi import APIRouter

from .schemas import SocialHealthResponse
from .service import module_health


def get_router() -> APIRouter:
    router = APIRouter(prefix="/api/modula/modules/social-media", tags=["modula", "social-media"])

    @router.get("/health", response_model=SocialHealthResponse)
    async def health():
        return module_health()

    return router
