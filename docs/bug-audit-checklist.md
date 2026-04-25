# Bug Audit Checklist

## Startup

- Main class in `pom.xml` exists and starts server.
- `Config.properties` loaded from correct path in IDE, JAR, and Docker.
- Required resources exist in JAR/classpath.
- Missing resources produce clear logs.
- Server port is valid and binds correctly.

## DB

- Driver and MySQL version are compatible.
- DB host is correct for local vs Docker.
- Connection pool min/max/lifetime are valid.
- SQL bootstrap imports successfully.
- Queries match real schema.

## Runtime

- Null checks around player/session/map/item.
- Disconnect cleanup is idempotent.
- Shared collections are thread-safe or synchronized.
- Infinite loops have sleep and stop condition.
- Exceptions in scheduled/background threads are logged.

## Economy/data integrity

- Item creation/deletion is transactional where needed.
- Currency changes are bounded and audited if admin-triggered.
- Gift codes cannot be reused unexpectedly.
- Trade/transaction has rollback on failure.

## Docker/Linux

- App uses DB host `db` in Docker.
- Entrypoint generates config from env.
- No production secrets in repo.
- Logs are accessible through `docker compose logs`.
