# modula-social-media

Flagship Social module for Modula.

Current release line: `1.3.0`

## Contents

- `manifest.json`: Marketplace submission manifest
- `module.json`: runtime launcher, service, surface, workflow, and widget metadata
- `frontend/routes/`: explicit route entries for `social`, `messages`, `explore`, and `notifications`
- `frontend/components/`: reusable layout, composer, feed, post, comment, reaction, activity, state, and widget components
- `frontend/stores/`: package-local store exports
- `frontend/lib/`: route unions and helper utilities
- `backend/`: install hooks, schemas, service, router, permissions, events, and repository contracts
- `docs/relationships-and-notifications.md`: follow graph, notification graph, and public identity linkage
- `src/components/SocialFeedSurface.svelte`: compatibility wrapper that now forwards to the structured `frontend/components/feed/FeedSurface.svelte`
- `src/lib/social-store.ts`: package-local reference state for the componentized sandbox surface
- `widgets/`: Social feed, post, and activity widget descriptors

## Frontend structure

```text
frontend/
├── routes/
│   ├── social/
│   ├── messages/
│   ├── explore/
│   └── notifications/
├── components/
│   ├── layout/
│   ├── composer/
│   ├── feed/
│   ├── posts/
│   ├── comments/
│   ├── reactions/
│   ├── activity/
│   ├── states/
│   └── widgets/
├── stores/
├── lib/
├── styles/
└── assets/
```

## Release packaging

Create the release archive from the repository root:

```bash
zip -r module.zip manifest.json module.json icon.svg src widgets README.md
```

The Marketplace backend expects both `manifest.json` and `module.json` to exist at the archive root.

`module.json` now points at the componentized source route (`frontend/routes/social/+page.svelte`) and the assembled feed surface (`frontend/components/feed/FeedSurface.svelte`). The archive still declares `bundle_entry: index.html`, but the editable truth remains this GitHub repo and its structured source tree.

## Current runtime note

This repository is ready for Marketplace submission and archive installation. The live Modula host already renders Social through the `social_host` renderer and backend Social service; this package repo now mirrors that architecture instead of lagging behind it.

## Relationship and Notification Graph

`1.3.0` adds the first identity-native relationship graph to the Social contract:

- follow / unfollow actions
- followers / following reads
- notification reads and unread counts
- public identity relationship state
- activity and notification hooks for follows, comments, and reactions

The authoritative contract lives in `module.json`, while the deeper behavior and data-shape guidance lives under `docs/`.
