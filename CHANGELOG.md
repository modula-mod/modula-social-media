# Changelog

## 1.4.1
- Added emoji reaction dropdown support (`👍 ❤️ 😂 🔥 🚀 🎉`) with per-emoji post reaction counts and user-selected reaction state.
- Replaced placeholder comments with a full inline comment flow (composer, list rendering, timestamping, and comment-like toggles).
- Added hashtag and mention parsing for posts/comments, clickable hashtag chips, and hashtag-based feed filtering.
- Extended the post composer with explicit tag input so tags and hashtags can be published together.
- Updated package metadata (`manifest.json`, `module.json`, `package.json`) and release source pointers for GitHub-first Marketplace updates.

## 1.3.1
- Completed the package contract for relationship and notification flows by declaring follow actions, follow events, and follow activity workflows in the runtime metadata.
- Aligned the release artifact metadata with the GitHub-first `v1.3.1` Marketplace update path.

## 1.3.0
- Added identity-native follow relationships and notification graph support to the Social package contract.
- Declared follow and notification capabilities, services, actions, events, and workflows for GitHub-first Marketplace releases.
- Tightened the package contract around relationship-aware identity surfaces, follow state, and notification-driven Social activity.

## 1.2.0
- Refactored the package repo into explicit `frontend/routes`, `frontend/components`, `frontend/stores`, `frontend/lib`, `frontend/styles`, `backend`, `widgets`, and `docs` areas.
- Split the package feed surface into reusable layout, composer, feed, post, comment, reaction, activity, state, and widget components instead of keeping the legacy all-in-one source file.
- Aligned package metadata and source pointers with the new componentized frontend tree and fixed version drift between `module.json`, `manifest.json`, and `package.json`.
- Kept the live host Social service contract intact for feed, comments, reactions, explore, notifications, Board widgets, and Reels compatibility.

## 1.1.0
- Rebuilt Social as the first flagship Modula module with a real feed, composer, comments, reactions, and identity-linked activity.
- Added `/social/explore` and `/social/notifications` as first-class shell-aware surfaces.
- Added `social-activity` Board widget and upgraded Social services, actions, events, and workflows for execution/automation integration.
- Kept Reels compatibility through the Social parent slots and service contracts.

## 1.0.0
- Initial Social Media marketplace module scaffold.
- Added runtime bridge metadata for Modula host rendering.
