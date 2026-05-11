"""Permission contract for the Modula Social module."""

READ_PERMISSIONS = {
    "social.feed.read",
    "social.explore.read",
    "social.comment.read",
    "social.profile.attach",
    "social.widgets.render",
}

WRITE_PERMISSIONS = {
    "social.post.create",
    "social.post.react",
    "social.comment.create",
    "social.notifications.emit",
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
