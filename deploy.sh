#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Publica a build de produção em /var/www/html/portfolio/dist/, de onde o
# nginx da VPS serve via `alias` (ver nginx da VPS, location ^~ /portfolio/).
# Uso: ./deploy.sh — local (SSH manual) ou chamado pela GH Action em .github/workflows/deploy.yml.

DIST_DEST="/var/www/html/portfolio/dist"
VITE_BASE_URL="$(grep -E '^VITE_BASE_URL=' .env 2>/dev/null | cut -d= -f2- || true)"
VITE_BASE_URL="${VITE_BASE_URL:-/portfolio}"

git pull

docker build --target build --build-arg VITE_BASE_URL="$VITE_BASE_URL" -t portfolio-build .

CID=$(docker create portfolio-build)
trap 'docker rm "$CID" >/dev/null' EXIT

rm -rf "${DIST_DEST:?}"/*
docker cp "$CID":/app/dist/. "$DIST_DEST"/

echo "Deploy ok: base=$VITE_BASE_URL -> $DIST_DEST"
