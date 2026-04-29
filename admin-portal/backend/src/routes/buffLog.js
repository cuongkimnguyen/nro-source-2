import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/buff-log?page=1&limit=30&admin=&target=&command=&dateFrom=&dateTo=
router.get('/', requireAuth, async (req, res) => {
  const page     = Math.max(1, parseInt(req.query.page    ?? '1',  10));
  const limit    = Math.min(200, Math.max(1, parseInt(req.query.limit ?? '30', 10)));
  const offset   = (page - 1) * limit;
  const admin    = String(req.query.admin   ?? '').trim();
  const target   = String(req.query.target  ?? '').trim();
  const command  = String(req.query.command ?? '').trim();
  const dateFrom = String(req.query.dateFrom ?? '').trim();
  const dateTo   = String(req.query.dateTo   ?? '').trim();

  const conditions = [];
  const params = [];

  if (admin)    { conditions.push('admin_name LIKE ?');    params.push(`%${admin}%`); }
  if (target)   { conditions.push('target_player LIKE ?'); params.push(`%${target}%`); }
  if (command)  { conditions.push('command = ?');          params.push(command); }
  if (dateFrom) { conditions.push('created_at >= ?');      params.push(dateFrom); }
  if (dateTo)   { conditions.push('created_at <= ?');      params.push(dateTo + ' 23:59:59'); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM admin_buff_log ${where}`, params
    );
    const [rows] = await pool.execute(
      `SELECT id, admin_name, command, target_player, item_id, item_name, quantity, options, created_at
       FROM admin_buff_log ${where}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return res.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('[buff-log]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
