#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Publica a build de produção em dist/, dentro do próprio repositório — é de
# lá que o nginx da VPS serve via `alias` (location ^~ /portfolio/).
# Uso: dá `git pull` ANTES de chamar isso — não faça pull daqui de dentro, o
# bash já tem o script carregado na memória e continuaria rodando a versão
# antiga do arquivo mesmo depois do pull trocar o conteúdo em disco.
# ./deploy.sh — local (SSH manual) ou chamado pela GH Action em .github/workflows/deploy.yml.

DIST_DEST="$(pwd)/dist"
VITE_BASE_URL="$(grep -E '^VITE_BASE_URL=' .env 2>/dev/null | cut -d= -f2- || true)"
VITE_BASE_URL="${VITE_BASE_URL:-/portfolio}"

docker build --target build --build-arg VITE_BASE_URL="$VITE_BASE_URL" -t portfolio-build .

CID=$(docker create portfolio-build)
trap 'docker rm "$CID" >/dev/null' EXIT

mkdir -p "$DIST_DEST"
rm -rf "${DIST_DEST:?}"/*
docker cp "$CID":/app/dist/. "$DIST_DEST"/

echo "Deploy ok: base=$VITE_BASE_URL -> $DIST_DEST"
