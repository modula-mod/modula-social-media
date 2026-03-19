# Frontend Architecture

The Social package source now follows the stricter Modula module structure:

- `frontend/routes/` assembles route surfaces only.
- `frontend/components/layout/` owns shared page shells.
- `frontend/components/composer/` owns post composition.
- `frontend/components/feed/` owns feed assembly and filters.
- `frontend/components/posts/` owns post header, body, media, and card rendering.
- `frontend/components/comments/` owns comment surface boundaries.
- `frontend/components/reactions/` owns reaction controls.
- `frontend/components/activity/` owns explore and identity discovery rails.
- `frontend/components/states/` owns loading and empty surfaces.
- `frontend/components/widgets/` keeps Board-facing widget previews separate from page routes.

The legacy `src/components/SocialFeedSurface.svelte` file remains only as a compatibility wrapper so older references do not become the authoring source of truth.
