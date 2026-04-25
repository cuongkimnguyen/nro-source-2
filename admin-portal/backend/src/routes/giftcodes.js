import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { writeAuditLog } from '../middleware/auditLog.js';

const router = Router();

// GET /api/giftcodes?page=1&limit=20
router.get('/', requireAuth, async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  ?? '1',  10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '20', 10)));
  const offset = (page - 1) * limit;

  try {
    const [[{ total }]] = await pool.execute('SELECT COUNT(*) AS total FROM giftcode');
    const [rows] = await pool.execute(
      'SELECT id, code, count_left, detail, datecreate, expired FROM giftcode ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return res.json({ total, page, limit, data: rows });
  } catch (err) {
    console.error('[giftcodes/list]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/giftcodes  — create new gift code
// body: { code, count_left, detail, expired }
router.post('/', requireAuth, async (req, res) => {
  const { code, count_left, detail, expired } = req.body ?? {};

  if (!code || !count_left || !detail) {
    return res.status(400).json({ error: 'code, count_left, and detail are required' });
  }
  if (typeof count_left !== 'number' || count_left < 1) {
    return res.status(400).json({ error: 'count_left must be a positive integer' });
  }

  // Validate detail is JSON array
  try { JSON.parse(detail); } catch {
    return res.status(400).json({ error: 'detail must be valid JSON' });
  }

  try {
    const expiredDate = expired ?? '2037-12-31 17:00:00';
    const [result] = await pool.execute(
      'INSERT INTO giftcode (code, count_left, detail, expired) VALUES (?, ?, ?, ?)',
      [code.trim(), count_left, detail, expiredDate]
    );

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: 'create_giftcode',
      targetType: 'giftcode',
      targetId: result.insertId,
      after: { code, count_left, expired: expiredDate },
      ip: req.ip,
    });

    return res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Gift code already exists' });
    }
    console.error('[giftcodes/create]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/giftcodes/:id/disable  — set count_left = 0
router.post('/:id/disable', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const [[gc]] = await pool.execute('SELECT id, code, count_left FROM giftcode WHERE id = ?', [id]);
    if (!gc) return res.status(404).json({ error: 'Gift code not found' });

    await pool.execute('UPDATE giftcode SET count_left = 0 WHERE id = ?', [id]);

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: 'disable_giftcode',
      targetType: 'giftcode',
      targetId: id,
      before: { count_left: gc.count_left },
      after:  { count_left: 0 },
      ip: req.ip,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error('[giftcodes/disable]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
