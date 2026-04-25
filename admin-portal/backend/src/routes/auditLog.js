import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/audit-log?page=1&limit=30&admin=&action=
router.get('/', requireAuth, async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit  = Math.min(200, Math.max(1, parseInt(req.query.limit ?? '30', 10)));
  const offset = (page - 1) * limit;
  const admin  = String(req.query.admin  ?? '').trim();
  const action = String(req.query.action ?? '').trim();

  const conditions = [];
  const params = [];

  if (admin)  { conditions.push('admin_username = ?'); params.push(admin); }
  if (action) { conditions.push('action LIKE ?');      params.push(`%${action}%`); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM admin_audit_log ${where}`, params
    );
    const [rows] = await pool.execute(
      `SELECT id, admin_username, action, target_type, target_id,
              before_payload, after_payload, ip_address, created_at
       FROM admin_audit_log ${where}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return res.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('[audit-log]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
