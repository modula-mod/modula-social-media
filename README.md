# modula-social-media

First marketplace module for Modula.

## Contents

- `manifest.json`: marketplace submission manifest
- `module.json`: runtime launcher and sandbox metadata
- `icon.svg`: module icon
- `src/routes/social/+page.svelte`: route entry for the social surface
- `src/components/SocialFeedSurface.svelte`: extracted UI from the built-in `/module/social` feature
- `src/lib/social-store.ts`: self-contained local state for feed, posts, follows, and polls
- `widgets/`: starter widget descriptors for feed/post surfaces

## Release packaging

Create the release archive from the repository root:

```bash
zip -r module.zip manifest.json module.json icon.svg src widgets README.md
```

The Marketplace backend expects both `manifest.json` and `module.json` to exist at the archive root.

`module.json` currently points at the source route (`src/routes/social/+page.svelte`) and declares a future `bundle_entry` of `index.html`. That matches the current archive contents without pretending the bundle runtime is already generated.

## Current runtime note

This repository is ready for Marketplace submission and archive installation.
The current Open WebUI checkout still needs the `ui-runtime` backend mounted for installed sandbox module bundles to execute in-app.
