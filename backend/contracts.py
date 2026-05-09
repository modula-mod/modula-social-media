"""Advanced module contracts exposed by Social 1.6.1."""
from __future__ import annotations

MODULE_WIDGETS = [
    {
        "id": "social-feed-widget",
        "title": "Social Feed Widget",
        "description": "Profile-scoped feed preview for Board and profile surfaces.",
        "surface": "board",
    },
    {
        "id": "social-stats-widget",
        "title": "Social Stats Widget",
        "description": "Post, reaction, comment, and follower signal summary.",
        "surface": "board",
    },
    {
        "id": "recent-comments-widget",
        "title": "Recent Comments Widget",
        "description": "Recent discussion activity with identity-safe author metadata.",
        "surface": "board",
    },
    {
        "id": "trending-posts-widget",
        "title": "Trending Posts Widget",
        "description": "Backend-ranked public posts for Explore and dashboard placement.",
        "surface": "explore",
    },
]

MODULE_FUNCTIONS = [
    {"id": "social.create_post", "title": "Create post", "permission": "social.post.create"},
    {"id": "social.list_feed", "title": "List feed", "permission": "social.feed.read"},
    {"id": "social.react_to_post", "title": "React to post", "permission": "social.reaction.create"},
    {"id": "social.comment_on_post", "title": "Comment on post", "permission": "social.comment.create"},
    {"id": "social.search_posts", "title": "Search posts", "permission": "social.explore.read"},
    {"id": "social.get_profile_activity", "title": "Get profile activity", "permission": "social.profile.extend"},
]

MODULE_PERMISSIONS = [
    {"id": "social.feed.read", "description": "Read profile-visible social feed data.", "risk": "low"},
    {"id": "social.post.create", "description": "Create posts as the current identity.", "risk": "medium"},
    {"id": "social.comment.create", "description": "Create comments as the current identity.", "risk": "medium"},
    {"id": "social.reaction.create", "description": "Create or update reactions.", "risk": "low"},
    {"id": "social.explore.read", "description": "Read public ranked Explore content.", "risk": "low"},
    {"id": "social.profile.extend", "description": "Attach social activity to the identity profile surface.", "risk": "medium"},
    {"id": "social.widget.read", "description": "Expose social widgets to Board/profile surfaces.", "risk": "low"},
    {"id": "social.notification.emit", "description": "Emit social notification events.", "risk": "medium"},
]

MODULE_NOTIFICATIONS = [
    {"id": "social.comment.created", "title": "Comment created", "default_enabled": True},
    {"id": "social.reaction.created", "title": "Reaction created", "default_enabled": True},
    {"id": "social.post.created", "title": "Post created", "default_enabled": True},
]

MODULE_EVENTS = [
    {"id": "social.post.created", "direction": "emitted"},
    {"id": "social.comment.created", "direction": "emitted"},
    {"id": "social.reaction.created", "direction": "emitted"},
    {"id": "social.search.requested", "direction": "accepted"},
]


def contract_payload(module_id: str, version: str) -> dict:
    return {
        "module_id": module_id,
        "version": version,
        "widgets": MODULE_WIDGETS,
        "functions": MODULE_FUNCTIONS,
        "permissions": MODULE_PERMISSIONS,
        "notifications": MODULE_NOTIFICATIONS,
        "events": MODULE_EVENTS,
    }
