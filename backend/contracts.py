"""Advanced module contracts exposed by Social 1.6.2."""
from __future__ import annotations

MODULE_WIDGETS = [
    {
        "id": "social-feed-widget",
        "title": "Social Feed Widget",
        "description": "Profile-scoped feed preview for Board and profile surfaces.",
        "surface": "board",
        "size": "medium",
        "entry": "widgets/SocialFeedWidget",
        "permissions": ["social.feed.read"],
        "data_source": "/api/modula/modules/social-media/feed",
        "refresh_policy": "on_focus_or_60s",
    },
    {
        "id": "quick-post-widget",
        "title": "Quick Post Widget",
        "description": "Compact Board composer for creating identity-scoped posts.",
        "surface": "board",
        "size": "small",
        "entry": "widgets/QuickPostWidget",
        "permissions": ["social.post.create"],
        "data_source": "/api/modula/modules/social-media/posts",
        "refresh_policy": "manual",
    },
    {
        "id": "social-stats-widget",
        "title": "Social Stats Widget",
        "description": "Post, reaction, comment, and follower signal summary.",
        "surface": "board",
        "size": "small",
        "entry": "widgets/SocialStatsWidget",
        "permissions": ["social.feed.read"],
        "data_source": "/api/modula/modules/social-media/profile/me",
        "refresh_policy": "on_focus_or_120s",
    },
    {
        "id": "recent-comments-widget",
        "title": "Recent Comments Widget",
        "description": "Recent discussion activity with identity-safe author metadata.",
        "surface": "board",
        "size": "medium",
        "entry": "widgets/RecentCommentsWidget",
        "permissions": ["social.comment.read"],
        "data_source": "/api/modula/modules/social-media/feed",
        "refresh_policy": "on_focus_or_60s",
    },
    {
        "id": "trending-posts-widget",
        "title": "Trending Posts Widget",
        "description": "Backend-ranked public posts for Explore and dashboard placement.",
        "surface": "explore",
        "size": "medium",
        "entry": "widgets/TrendingPostsWidget",
        "permissions": ["social.explore.read"],
        "data_source": "/api/modula/modules/social-media/explore",
        "refresh_policy": "on_focus_or_120s",
    },
    {
        "id": "trending-tags-widget",
        "title": "Trending Tags Widget",
        "description": "Popular tags from backend-ranked Explore content.",
        "surface": "board",
        "size": "small",
        "entry": "widgets/TrendingTagsWidget",
        "permissions": ["social.explore.read"],
        "data_source": "/api/modula/modules/social-media/explore",
        "refresh_policy": "on_focus_or_120s",
    },
]

MODULE_FUNCTIONS = [
    {"id": "social.post.create", "title": "Create post", "permission": "social.post.create"},
    {"id": "social.feed.read", "title": "List feed", "permission": "social.feed.read"},
    {"id": "social.post.react", "title": "React to post", "permission": "social.post.react"},
    {"id": "social.comment.create", "title": "Comment on post", "permission": "social.comment.create"},
    {"id": "social.comment.read", "title": "Read comments", "permission": "social.comment.read"},
    {"id": "social.explore.read", "title": "Search and explore posts", "permission": "social.explore.read"},
    {"id": "social.profile.attach", "title": "Attach social profile extension", "permission": "social.profile.attach"},
    {"id": "social.widgets.render", "title": "Render social widgets", "permission": "social.widgets.render"},
    {"id": "social.notifications.emit", "title": "Emit social notifications", "permission": "social.notifications.emit"},
]

MODULE_PERMISSIONS = [
    {"id": "social.feed.read", "description": "Read profile-visible social feed data.", "risk": "low"},
    {"id": "social.post.create", "description": "Create posts as the current identity.", "risk": "medium"},
    {"id": "social.post.react", "description": "Create or update post reactions.", "risk": "low"},
    {"id": "social.comment.create", "description": "Create comments as the current identity.", "risk": "medium"},
    {"id": "social.comment.read", "description": "Read comments on visible posts.", "risk": "low"},
    {"id": "social.explore.read", "description": "Read public ranked Explore content.", "risk": "low"},
    {"id": "social.profile.attach", "description": "Attach social activity to the identity profile surface.", "risk": "medium"},
    {"id": "social.widgets.render", "description": "Expose social widgets to Board/profile surfaces.", "risk": "low"},
    {"id": "social.notifications.emit", "description": "Emit social notification events.", "risk": "medium"},
]

MODULE_NOTIFICATIONS = [
    {"id": "social.post.created", "title": "Post created", "default_enabled": True},
    {"id": "social.comment.created", "title": "Comment created", "default_enabled": True},
    {"id": "social.reaction.created", "title": "Reaction created", "default_enabled": True},
    {"id": "social.mention.created", "title": "Mention created", "default_enabled": True},
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
