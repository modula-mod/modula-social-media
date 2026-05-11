"""Module-local Social service helpers.

The canonical host API for this module is /api/modula/modules/social-media.
This package contract keeps the GitHub module self-describing and ready for
future dynamic backend loading.
"""
from __future__ import annotations

from .events import EVENTS_EMITTED
from .permissions import REQUIRED_PERMISSIONS, validate_declared_permissions
from .contracts import contract_payload

MODULE_ID = "social-media"
MODULE_VERSION = "1.6.2"
CANONICAL_API_PREFIX = "/api/modula/modules/social-media"
BACKEND_CONTRACT_VERSION = "2026-05-06"


def module_health() -> dict:
    return {
        "status": "ok",
        "module_id": MODULE_ID,
        "version": MODULE_VERSION,
        "backend_contract": BACKEND_CONTRACT_VERSION,
        "canonical_api": CANONICAL_API_PREFIX,
        "events_emitted": list(EVENTS_EMITTED),
        "required_permissions": list(REQUIRED_PERMISSIONS),
    }


def module_contracts() -> dict:
    return contract_payload(MODULE_ID, MODULE_VERSION)


def validate_manifest_permissions(manifest: dict) -> dict:
    return validate_declared_permissions(manifest.get("permissions") or [])
