#!/usr/bin/env sh
set -eu

BASE_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$BASE_DIR"

exec java -server \
  -Dfile.encoding=UTF-8 \
  -cp "/app/app.jar:/app/lib/*" \
  nro.models.server.ServerManager