# Architecture

The Social Media module is the first flagship Modula module.

It now combines:
- runtime metadata in `module.json`
- Marketplace metadata in `manifest.json`
- GitHub-first package source under a componentized `frontend/` and `backend/` tree
- host-rendered Social surfaces for `/social`, `/social/messages`, `/social/explore`, and `/social/notifications`
- a real backend Social service in the Modula host
- identity-linked authorship and activity
- explicit `public` / `followers` / `private` post visibility enforced in backend service logic
- relationship-aware feed shaping that prioritizes self and followed identities before general public content
- Board widgets driven by the same Social state
- extension slots that keep Reels and future plugins aligned to the parent Social module
