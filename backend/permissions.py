"""Permission contract for the Modula Social module."""

READ_PERMISSIONS = {
    "profile.read",
    "notifications.read",
}

WRITE_PERMISSIONS = {
    "post.create",
    "comment.create",
    "reaction.create",
    "follow.create",
    "share.create",
}

REQUIRED_PERMISSIONS = tuple(sorted(READ_PERMISSIONS | WRITE_PERMISSIONS))


def validate_declared_permissions(permissions: list[str] | tuple[str, ...]) -> dict:
    declared = {str(item).strip() for item in permissions if str(item).strip()}
    missing = sorted(set(REQUIRED_PERMISSIONS) - declared)
    unknown = sorted(declared - set(REQUIRED_PERMISSIONS))
    return {
        "valid": not missing and not unknown,
        "missing": missing,
        "unknown": unknown,
        "required": list(REQUIRED_PERMISSIONS),
    }
