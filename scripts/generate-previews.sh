#!/usr/bin/env bash
# Generate cabinet preview clips from running game servers.
# Usage: ./scripts/generate-previews.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS="${ROOT}/scripts"
GLORP_REPO="${GLORP_REPO:-$HOME/git/musical_defense}"
BONE_REPO="${BONE_REPO:-$HOME/git/system/games/bone_bombers}"
GLORP_URL="${GLORP_URL:-http://127.0.0.1:8888/glorp-busters.html}"
BONE_URL="${BONE_URL:-http://127.0.0.1:8889/bone_bombers.html}"

wait_url() {
  local url="$1"
  local label="$2"
  for _ in $(seq 1 40); do
    if curl -fsS -o /dev/null "$url"; then
      echo "ok ${label} ready at ${url}"
      return 0
    fi
    sleep 1
  done
  echo "error: ${label} not reachable at ${url}" >&2
  return 1
}

ensure_games() {
  if ! curl -fsS -o /dev/null "$GLORP_URL" || ! curl -fsS -o /dev/null "$BONE_URL"; then
    echo "starting preview game servers"
    GLORP_REPO="$GLORP_REPO" BONE_REPO="$BONE_REPO" \
      docker compose -f "${SCRIPTS}/docker-compose.games.yml" up -d --build
    wait_url "$GLORP_URL" "Glorp Busters"
    wait_url "$BONE_URL" "Bone Bombers"
  fi
}

ensure_games

docker compose -f "${SCRIPTS}/docker-compose.previews.yml" build capture
docker compose -f "${SCRIPTS}/docker-compose.previews.yml" run --rm \
  -e GLORP_URL="$GLORP_URL" \
  -e BONE_URL="$BONE_URL" \
  capture node scripts/capture-preview.mjs

echo "ok previews written to assets/previews/"
