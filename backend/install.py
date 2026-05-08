"""Install hook metadata for Modula Social."""


def install(context=None) -> dict:
    return {"status": "ok", "module": "social-media", "hook": "install", "context_bound": context is not None}
