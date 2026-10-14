#!/usr/bin/env bash
# Rebuilds UI-Design/UI-Design-5-standalone.html (one file, opens by double-click, no npm needed to VIEW it).
# Build tools install into a temp folder, never into the repo. Usage: bash UI-Design/standalone-build/build.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; SRC="$HERE/../UI-Design-5/src"; OUT="$HERE/../UI-Design-5-standalone.html"
T="$(mktemp -d)"; cp "$HERE/entry.jsx" "$HERE/link-shim.jsx" "$SRC/app/globals.css" "$T/"; cd "$T"
npm init -y >/dev/null; npm i --no-audit --no-fund react@19.2.6 react-dom@19.2.6 lucide-react@^1.47.0 esbuild @tailwindcss/cli@4.1.17 tailwindcss@4.1.17 >/dev/null
NODE_PATH="$T/node_modules" npx esbuild entry.jsx --bundle --minify --format=iife --jsx=automatic --define:process.env.NODE_ENV=\"production\" --alias:@="$SRC" --alias:next/link=./link-shim.jsx --outfile=app.js
npx @tailwindcss/cli -i globals.css -o app.css --minify
node -e 'const f=require("fs");const js=f.readFileSync("app.js","utf8").replace(/<\/script/g,"<\\/script"),css=f.readFileSync("app.css","utf8");f.writeFileSync(process.argv[1],`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>Meridian · Portfolio (design)</title>\n<style>${css}</style></head>\n<body><div id="root"></div>\n<script>${js}</script></body></html>`)' "$OUT"
rm -rf "$T"; echo "Wrote $OUT"
