# Visibility

Social `1.4.0` uses an explicit visibility model for posts:

- `public`
- `followers`
- `private`

## Rules

- `public`: eligible for public identity surfaces, public activity, and explore.
- `followers`: visible to the author and identities that follow the author.
- `private`: visible only to the author.

## Feed shaping

The host Social service uses relationship-aware ordering:

1. self content
2. followed identities
3. general public content

Visibility is enforced before ordering, so ranking never bypasses privacy.

## Identity surfaces

The canonical identity route `/identity/<handle>` renders only posts visible to the current viewer.

That means:

- public viewers see public content only
- followers may see `followers` content
- self sees all of their own content
