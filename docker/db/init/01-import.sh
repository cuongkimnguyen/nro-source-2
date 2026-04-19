#!/usr/bin/env bash
set -euo pipefail

echo "[db-init] importing /docker-entrypoint-initdb.d/nro1.sql into ${MYSQL_DATABASE}"
mysql -u"${MYSQL_USER:-root}" -p"${MYSQL_PASSWORD:-$MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE}" < /docker-entrypoint-initdb.d/nro1.sql
