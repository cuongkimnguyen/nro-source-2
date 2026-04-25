#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

if [ ! -f "$TARGET_DIR/pom.xml" ]; then
  echo "ERROR: target does not look like nro-source-2 root; pom.xml not found: $TARGET_DIR" >&2
  exit 1
fi

cp -R "$SCRIPT_DIR/.claude" "$TARGET_DIR/.claude"
cp "$SCRIPT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
mkdir -p "$TARGET_DIR/docs" "$TARGET_DIR/templates"
cp -R "$SCRIPT_DIR/docs/." "$TARGET_DIR/docs/"
cp -R "$SCRIPT_DIR/templates/." "$TARGET_DIR/templates/"

echo "Installed Claude project kit into $TARGET_DIR"
echo "Next: place web.zip extraction under $TARGET_DIR/reference/web-source, then run Claude Code."
