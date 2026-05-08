"""Uninstall hook metadata for Modula Social."""


def uninstall(context=None) -> dict:
    return {"status": "ok", "module": "social-media", "hook": "uninstall", "context_bound": context is not None}
