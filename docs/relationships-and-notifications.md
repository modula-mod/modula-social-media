# Relationships and Notifications

## Scope

Social `1.3.0` introduces the first identity-native relationship and notification graph for Modula.

The graph is intentionally narrow in this release:

- relationship type: `follow`
- notification types:
  - `social.follow.created`
  - `social.comment.created`
  - `social.reaction.created`

## Identity model

Relationships are tied to Modula identities, not email addresses.

- `source_identity_id`
- `target_identity_id`
- `relationship_type`

This keeps Social aligned with:

- public identity routes: `/identity/<handle>`
- private workspace state: `/profile`
- future identity-aware feed ranking
- notification delivery

## Public identity integration

Public identity pages can safely expose:

- follow / unfollow state
- follower count
- following count
- compact follower / following previews
- public social activity

Public identity pages must not expose:

- private mailbox state
- drafts
- private module surfaces
- credential email details

## Notification model

Notifications are persisted separately from feed activity.

Core fields:

- `notification_id`
- `recipient_identity_id`
- `actor_identity_id`
- `notification_type`
- `target_id`
- `read`
- `created_at`

## Runtime contract

The package metadata declares the relationship and notification surface through:

- capabilities:
  - `social.follow.create`
  - `social.follow.read`
  - `social.notifications.read`
- actions:
  - `social.follow.create`
  - `social.follow.remove`
- events:
  - `social.follow.created`

This contract is consumed through the GitHub-first release flow:

GitHub repo -> GitHub release artifact -> Marketplace update -> runtime refresh
