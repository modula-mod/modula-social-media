#!/usr/bin/env node
import fs from 'node:fs';
const required = ['manifest.json', 'module.json', 'frontend', 'backend', 'widgets', 'README.md', 'CHANGELOG.md', 'icon.svg'];
const missing = required.filter((path) => !fs.existsSync(path));
if (missing.length) {
  console.error(`Missing required paths: ${missing.join(', ')}`);
  process.exit(1);
}
console.log('Module structure valid.');
