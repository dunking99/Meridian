#!/usr/bin/env bash
# Usage:  bash UI-Design/standalone-build/build.sh UI-Design/UI-Design-5   [--out file.html]
# Bundles a Next.js design folder into one HTML file that opens by double-click. Needs Node 18+.
exec node "$(cd "$(dirname "$0")" && pwd)/build.mjs" "$@"
