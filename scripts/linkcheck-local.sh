#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=".tmp-linkcheck-root"
PORT="4173"
HOST="127.0.0.1"
BASE_PATH="CVWebsite"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -rf "$ROOT_DIR"
}
trap cleanup EXIT

rm -rf "$ROOT_DIR"
mkdir -p "$ROOT_DIR/$BASE_PATH"
cp -a dist/. "$ROOT_DIR/$BASE_PATH/"

python3 -m http.server "$PORT" --bind "$HOST" --directory "$ROOT_DIR" >/dev/null 2>&1 &
SERVER_PID=$!

# brief wait for server startup
sleep 1

npx linkinator "http://$HOST:$PORT/$BASE_PATH/" --recurse
