"""Background job declarations for the Social module."""

JOBS = [
    {"id": "social.notifications.digest", "schedule": "manual", "description": "Build notification digest projections."},
    {"id": "social.trends.refresh", "schedule": "manual", "description": "Refresh social trend projections."},
]
