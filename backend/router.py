"""FastAPI router factory for future dynamic module backend loading."""
from __future__ import annotations

from fastapi import APIRouter

from .schemas import SocialHealthResponse
from .service import module_contracts, module_health


def get_router() -> APIRouter:
    router = APIRouter(prefix="/api/modula/modules/social-media", tags=["modula", "social-media"])

    @router.get("/health", response_model=SocialHealthResponse)
    async def health():
        return module_health()

    @router.get("/contracts")
    async def contracts():
        return module_contracts()

    @router.get("/widgets")
    async def widgets():
        return module_contracts()["widgets"]

    @router.get("/functions")
    async def functions():
        return module_contracts()["functions"]

    @router.get("/permissions")
    async def permissions():
        return module_contracts()["permissions"]

    @router.get("/notifications")
    async def notifications():
        return module_contracts()["notifications"]

    @router.get("/events")
    async def events():
        return module_contracts()["events"]

    @router.post("/events")
    async def emit_event(payload: dict):
        return {"status": "accepted", "module_id": "social-media", "event": payload}

    return router
