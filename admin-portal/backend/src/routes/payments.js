import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/payments?page=1&limit=20&search=
router.get('/', requireAuth, async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '20', 10)));
  const offset = (page - 1) * limit;
  const search = String(req.query.search ?? '').trim();

  const params = [];
  let where = '';
  if (search) {
    where = 'WHERE name LIKE ? OR refNo LIKE ? OR card_telco LIKE ?';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  try {
    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM payments ${where}`, params
    );
    const [rows] = await pool.execute(
      `SELECT id, name, refNo, date, card_telco,
              declared_amount, final_credited_amount,
              status_text, api_status_code, is_credited
       FROM payments ${where}
       ORDER BY date DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    return res.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('[payments]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
