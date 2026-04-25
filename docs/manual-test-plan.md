# Manual Test Plan

## Server

```bash
mvn -q -DskipTests package
docker compose config
docker compose build
docker compose up -d db
docker compose logs --tail=100 db
docker compose up -d app
docker compose logs --tail=200 app
```

Check:

- DB container healthy.
- App starts without NPE.
- Config values match `.env`.
- Server port is listening.
- SQL imported on fresh volume.

## Admin portal

```bash
find admin-portal -name '*.php' -print0 | xargs -0 -n1 php -l
```

Check:

- Login page loads.
- Invalid login fails.
- Valid admin login succeeds.
- Dashboard loads.
- Player search escapes output.
- POST without CSRF fails.
- Admin action writes audit log.
- Logout destroys session.
