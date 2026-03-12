#!/usr/bin/env node
import { execSync } from 'node:child_process';
execSync('zip -r module.zip . -x ".git/*" "node_modules/*" "*.DS_Store"', { stdio: 'inherit' });
