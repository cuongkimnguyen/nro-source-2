# Admin Portal Specification

## Purpose

Provide a secure internal web UI to manage the NRO game server using the existing game DB and PHP web reference.

## Reference source

Expected path after unzip:

```text
reference/web-source/web/htdocs/
  Api/
  Auth/
  Controllers/
  Pages/
  View/
```

Use it to understand visual style, routing conventions, DB connection patterns, and existing game web actions. Do not copy insecure patterns blindly.

## First release scope

### Dashboard

- DB connection status.
- Server status placeholder.
- Online player count if schema/code exposes it.
- Recent admin actions.

### Player Management

- Search by account/player id/name.
- View profile summary.
- Lock/unlock account if schema supports status fields.
- Adjust coin/gem only through service with audit log.

### Server Control

- Broadcast notice.
- Maintenance mode flag.
- Kick player if existing PHP API or Java command path supports it.
- Restart should be documented/manual unless a safe local-only control channel exists.

### Gift Code

- List/create/disable gift code if schema supports it.
- Every creation must be audited.

## Database additions

Create migration:

```text
admin-portal/sql/migrations/V001__admin_portal.sql
```

Minimum tables:

- `admin_users`
- `admin_audit_log`
- optional `server_commands` if command queue approach is used.

## Security acceptance criteria

- Login required for all admin pages.
- CSRF required for every POST.
- PDO prepared statements only.
- Escaped output.
- Audit log for every state change.
- No arbitrary command execution.
