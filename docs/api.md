# API

The Social module now depends on the host Social service exposed at `/api/modula/social`.

Core endpoints:
- `GET /api/modula/social/feed`
- `POST /api/modula/social/post`
- `GET /api/modula/social/post/{post_id}`
- `POST /api/modula/social/post/{post_id}/comment`
- `POST /api/modula/social/post/{post_id}/reaction`
- `GET /api/modula/social/activity/{identity_id}`
- `GET /api/modula/social/explore`
- `GET /api/modula/social/notifications`

Legacy compatibility is preserved through `GET|POST /api/modula/social/posts` for profile-linked post surfaces.
