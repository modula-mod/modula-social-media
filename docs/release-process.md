# Release Process

1. Update source.
2. Bump `package.json`, `manifest.json`, and `module.json` version.
3. Run `node scripts/pack-module.mjs`.
4. Upload `module.zip` to the GitHub release.
