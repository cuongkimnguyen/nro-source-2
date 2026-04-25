# NRO Admin Portal

Node.js (Express) + React (Vite) admin portal for the NRO game server.

## Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Backend  | Node.js 18+, Express, mysql2, bcryptjs, jsonwebtoken |
| Frontend | React 18, Vite, React Router v6, Axios |
| DB       | Same MySQL database as game server |

---

## Setup

### 1. Run the DB migration

```bash
mysql -u root -p nro < admin-portal/sql/migrations/V001__admin_portal_users_and_audit_log.sql
```

This creates two tables:
- `admin_portal_users` — separate admin credentials (bcrypt hashed)
- `admin_audit_log` — every admin action recorded

A default admin is seeded: **username=`admin`**, **password=`Admin@1234`**.
**Change it immediately** after first login (update the hash in the DB or add a change-password endpoint).

To generate a new bcrypt hash:
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('YourNewPassword', 12))"
```

Then:
```sql
UPDATE admin_portal_users SET password = '<hash>' WHERE username = 'admin';
```

### 2. Backend

```bash
cd admin-portal/backend
cp .env.example .env          # edit DB_HOST, DB_NAME, DB_USER, DB_PASS, JWT_SECRET
npm install
npm run dev                   # dev with nodemon — port 4000
# or
npm start                     # production
```

### 3. Frontend

```bash
cd admin-portal/frontend
npm install
npm run dev                   # Vite dev server — port 5173 (proxies /api → :4000)
# or
npm run build && npm run preview
```

Open: http://localhost:5173

---

## API endpoints (all require `Authorization: Bearer <token>` except /auth/login)

| Method | Path                              | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/login                   | Login, returns JWT       |
| POST   | /api/auth/logout                  | Logout (audit log)       |
| GET    | /api/dashboard                    | Stats + recent audit     |
| GET    | /api/players                      | List/search accounts     |
| GET    | /api/players/:id                  | Account + player detail  |
| POST   | /api/players/:id/ban              | Ban or unban             |
| POST   | /api/players/:id/adjust-currency  | Adjust vnd/vang/vip etc  |
| GET    | /api/giftcodes                    | List gift codes          |
| POST   | /api/giftcodes                    | Create gift code         |
| POST   | /api/giftcodes/:id/disable        | Disable gift code        |
| GET    | /api/server/status                | Server status            |
| POST   | /api/server/maintenance           | Toggle maintenance mode  |
| POST   | /api/server/broadcast             | Send broadcast message   |
| GET    | /api/payments                     | Payment history          |
| GET    | /api/audit-log                    | Admin audit log          |
| GET    | /health                           | Health check             |

---

## Manual test steps

1. `GET /health` → `{"ok":true}`
2. `POST /api/auth/login` with wrong password → 401
3. `POST /api/auth/login` with `admin / Admin@1234` → JWT token
4. `GET /api/dashboard` with token → stats JSON
5. `GET /api/players` → paginated account list
6. `POST /api/players/1/ban` with `{"ban":true}` → bans account; check `admin_audit_log`
7. `POST /api/players/1/ban` with `{"ban":false}` → unbans; audit log updated
8. `POST /api/giftcodes` with `{"code":"TEST1","count_left":100,"detail":"[]"}` → 201
9. `POST /api/giftcodes/1/disable` → count_left = 0
10. `POST /api/server/maintenance` with `{"enable":true}` → trangthai = 'baotri'
11. `POST /api/server/maintenance` with `{"enable":false}` → trangthai = 'hoatdong'

---

## Security notes

- JWT is stateless — signing secret in `JWT_SECRET` env var. Keep it ≥32 random chars.
- Login rate-limited to 10 attempts / 15 min per IP.
- All state-changing actions written to `admin_audit_log`.
- No shell command execution exposed.
- `DB_PASS` and `JWT_SECRET` never leave the backend process.

---

## Next modules to add

- [ ] Admin user management (create/disable portal users, change password)
- [ ] Kick player (requires game server socket or DB flag integration)
- [ ] Item/economy audit (history_transaction viewer)
- [ ] napthe (card top-up) reviewer
- [ ] Role-based access (superadmin vs. read-only admin)
