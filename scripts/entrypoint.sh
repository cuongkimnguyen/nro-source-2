#!/usr/bin/env sh
set -eu

APP_DIR=/app
CONFIG_FILE="$APP_DIR/Config.properties"

update_prop() {
  key="$1"
  value="$2"
  if grep -qE "^${key}=" "$CONFIG_FILE"; then
    sed -i "s#^${key}=.*#${key}=${value}#" "$CONFIG_FILE"
  else
    printf '\n%s=%s\n' "$key" "$value" >> "$CONFIG_FILE"
  fi
}

update_prop "database.host" "${DB_HOST:-db}"
update_prop "database.port" "${DB_PORT:-3306}"
update_prop "database.name" "${DB_NAME:-ngocrong}"
update_prop "database.user" "${DB_USER:-root}"
update_prop "database.pass" "${DB_PASSWORD:-rootpassword}"
update_prop "server.ip" "${SERVER_IP:-127.0.0.1}"
update_prop "server.port" "${SERVER_PORT:-14445}"

if [ -n "${SERVER_NAME:-}" ]; then
  update_prop "server.name" "$SERVER_NAME"
fi
if [ -n "${SERVER_SV1:-}" ]; then
  update_prop "server.sv1" "$SERVER_SV1"
fi

exec ./run.sh
