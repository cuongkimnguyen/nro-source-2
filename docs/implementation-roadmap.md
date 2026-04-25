# Implementation Roadmap

## Phase 1 — Stabilize build/runtime

- Verify Maven package.
- Fix main class/resource/config startup issues.
- Fix Docker Compose and entrypoint issues.
- Confirm SQL import behavior.

## Phase 2 — Audit and fix critical bugs

- Server startup.
- DB connection.
- Map/resource loading.
- Session cleanup.
- High-risk NPEs.

## Phase 3 — Admin portal MVP

- Generate PHP skeleton.
- Add auth/session/CSRF.
- Add dashboard.
- Add player search/detail.
- Add audit log migration.

## Phase 4 — Admin operations

- Maintenance mode.
- Broadcast notice.
- Kick player integration.
- Gift code manager.
- Economy adjustment with audit.

## Phase 5 — Hardening

- Security review.
- Docker production profile.
- Backup/restore notes.
- Manual QA checklist.
