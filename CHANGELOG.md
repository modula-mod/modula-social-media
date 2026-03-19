# Changelog

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
