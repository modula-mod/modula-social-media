#!/usr/bin/env node
import fs from 'node:fs';

const required = [
  'manifest.json',
  'module.json',
  'frontend',
  'backend',
  'widgets',
  'README.md',
  'CHANGELOG.md',
  'icon.svg'
];

const missing = required.filter((path) => !fs.existsSync(path));
if (missing.length) {
  console.error(`Missing required paths: ${missing.join(', ')}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const moduleManifest = JSON.parse(fs.readFileSync('module.json', 'utf8'));

if (manifest.id !== moduleManifest.id) {
  console.error(`manifest.id (${manifest.id}) must match module.json id (${moduleManifest.id})`);
  process.exit(1);
}

if (manifest.version !== moduleManifest.version) {
  console.error(`manifest.version (${manifest.version}) must match module.json version (${moduleManifest.version})`);
  process.exit(1);
}

const runtime = moduleManifest.runtime;
if (!runtime || typeof runtime !== 'object') {
  console.error('module.json runtime must be an object');
  process.exit(1);
}

if (runtime.mode !== 'svelte_component') {
  console.error(`module.json runtime.mode must be svelte_component (found: ${runtime.mode})`);
  process.exit(1);
}

if (!runtime.entry || !runtime.style) {
  console.error('module.json runtime.entry and runtime.style are required for native mode');
  process.exit(1);
}

const nativeEntry = String(runtime.entry);
const nativeStyle = String(runtime.style);
if (!fs.existsSync(nativeEntry)) {
  console.error(`Missing runtime entry artifact: ${nativeEntry}`);
  process.exit(1);
}

if (!fs.existsSync(nativeStyle)) {
  console.error(`Missing runtime style artifact: ${nativeStyle}`);
  process.exit(1);
}

const fallbackEntry = runtime?.fallback?.entry;
if (!fallbackEntry || !fs.existsSync(String(fallbackEntry))) {
  console.error(`Missing runtime fallback entry: ${fallbackEntry ?? '(not set)'}`);
  process.exit(1);
}

console.log('Module structure and native runtime manifest are valid.');
