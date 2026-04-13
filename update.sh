#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Updating RigStack..."
echo ""

# Pull latest
git pull origin main

# Install any new frontend deps
echo ""
echo "Checking dependencies..."
npm install --silent

# Build
echo ""
echo "Building..."
npm run tauri build

echo ""
echo "Done. Find the app in src-tauri/target/release/bundle/"
