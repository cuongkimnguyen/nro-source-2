import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { writeAuditLog } from '../middleware/auditLog.js';

const router = Router();

// GET /api/players?search=&page=1&limit=20
router.get('/', requireAuth, async (req, res) => {
  const search = String(req.query.search ?? '').trim();
  const page   = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '20', 10)));
  const offset = (page - 1) * limit;

  try {
    let countSql = `
      SELECT COUNT(*) AS total
      FROM account a
      LEFT JOIN player p ON p.account_id = a.id
    `;
    let dataSql = `
      SELECT
        a.id, a.username, a.email, a.ban, a.is_admin, a.admin,
        a.last_time_login, a.ip_address, a.active, a.vnd, a.tongnap,
        a.vang, a.vip, a.server_login, a.create_time,
        p.name AS player_name, p.rank, p.head, p.gender, p.clan_id
      FROM account a
      LEFT JOIN player p ON p.account_id = a.id
    `;

    const params = [];
    if (search) {
      const clause = ` WHERE a.username LIKE ? OR p.name LIKE ? OR a.email LIKE ?`;
      countSql += clause;
      dataSql  += clause;
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    dataSql += ` ORDER BY a.id DESC LIMIT ? OFFSET ?`;

    const [[{ total }]] = await pool.execute(countSql, params);
    const [rows] = await pool.execute(dataSql, [...params, limit, offset]);

    return res.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('[players/list]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/players/:id
router.get('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const [[account]] = await pool.execute(
      `SELECT id, username, email, ban, is_admin, admin,
              last_time_login, last_time_logout, ip_address,
              active, vnd, tongnap, vang, vip, server_login, create_time,
              event_point, tichdiem, luotquay, gioithieu
       FROM account WHERE id = ?`,
      [id]
    );
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const [[player]] = await pool.execute(
      `SELECT id, name, head, gender, clan_id, rank, create_time, event_point, firstTimeLogin
       FROM player WHERE account_id = ?`,
      [id]
    );

    const [payments] = await pool.execute(
      `SELECT id, refNo, date, declared_amount, final_credited_amount, status_text, is_credited
       FROM payments WHERE name = ? ORDER BY date DESC LIMIT 20`,
      [account.username]
    );

    return res.json({ account, player: player ?? null, payments });
  } catch (err) {
    console.error('[players/detail]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/players/:id/ban
router.post('/:id/ban', requireAuth, async (req, res) => {
  const id  = parseInt(req.params.id, 10);
  const { ban } = req.body ?? {};
  if (isNaN(id) || typeof ban !== 'boolean') {
    return res.status(400).json({ error: 'id (number) and ban (boolean) are required' });
  }

  try {
    const [[before]] = await pool.execute(
      'SELECT id, username, ban FROM account WHERE id = ?', [id]
    );
    if (!before) return res.status(404).json({ error: 'Account not found' });

    await pool.execute('UPDATE account SET ban = ? WHERE id = ?', [ban ? 1 : 0, id]);

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: ban ? 'ban_account' : 'unban_account',
      targetType: 'account',
      targetId: id,
      before: { ban: before.ban },
      after:  { ban: ban ? 1 : 0 },
      ip: req.ip,
    });

    return res.json({ ok: true, ban });
  } catch (err) {
    console.error('[players/ban]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/players/:id/adjust-currency
// body: { field: 'vnd'|'vang'|'vip', delta: number, reason: string }
router.post('/:id/adjust-currency', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { field, delta, reason } = req.body ?? {};

  const ALLOWED_FIELDS = ['vnd', 'vang', 'vip', 'tichdiem', 'event_point'];
  if (isNaN(id) || !ALLOWED_FIELDS.includes(field) || typeof delta !== 'number') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    const [[account]] = await pool.execute(
      `SELECT id, username, vnd, vang, vip, tichdiem, event_point FROM account WHERE id = ?`,
      [id]
    );
    if (!account) return res.status(404).json({ error: 'Account not found' });

    const oldVal = account[field];
    const newVal = oldVal + delta;
    if (newVal < 0) return res.status(400).json({ error: 'Result would be negative' });

    // field is validated against ALLOWED_FIELDS — safe to interpolate
    await pool.execute(`UPDATE account SET \`${field}\` = ? WHERE id = ?`, [newVal, id]);

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: 'adjust_currency',
      targetType: 'account',
      targetId: id,
      before: { [field]: oldVal },
      after:  { [field]: newVal, reason: reason ?? '' },
      ip: req.ip,
    });

    return res.json({ ok: true, field, oldVal, newVal });
  } catch (err) {
    console.error('[players/adjust-currency]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
