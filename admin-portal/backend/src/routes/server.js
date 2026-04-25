import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { writeAuditLog } from '../middleware/auditLog.js';

const router = Router();

// GET /api/server/status
router.get('/status', requireAuth, async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT domain, title, tenmaychu, trangthai, android, iphone, windows, java FROM adminpanel LIMIT 1'
    );
    return res.json(rows[0] ?? {});
  } catch (err) {
    console.error('[server/status]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/server/maintenance
// body: { enable: true|false }
router.post('/maintenance', requireAuth, async (req, res) => {
  const { enable } = req.body ?? {};
  if (typeof enable !== 'boolean') {
    return res.status(400).json({ error: 'enable (boolean) is required' });
  }

  const newStatus = enable ? 'baotri' : 'hoatdong';

  try {
    const [[before]] = await pool.execute('SELECT trangthai FROM adminpanel LIMIT 1');
    await pool.execute('UPDATE adminpanel SET trangthai = ?', [newStatus]);

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: enable ? 'enable_maintenance' : 'disable_maintenance',
      targetType: 'server',
      before: { trangthai: before?.trangthai },
      after:  { trangthai: newStatus },
      ip: req.ip,
    });

    return res.json({ ok: true, trangthai: newStatus });
  } catch (err) {
    console.error('[server/maintenance]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/server/broadcast  — placeholder: stores in notify table if it exists
// body: { message: string }
router.post('/broadcast', requireAuth, async (req, res) => {
  const { message } = req.body ?? {};
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // Attempt to insert into notify table (best-effort)
    await pool.execute(
      'INSERT INTO notify (noidung, ngaytao) VALUES (?, NOW())',
      [message.trim()]
    ).catch(() => {/* notify table schema may differ; ignore */});

    await writeAuditLog({
      adminUsername: req.admin.username,
      action: 'broadcast',
      after: { message: message.trim() },
      ip: req.ip,
    });

    return res.json({ ok: true, note: 'Broadcast recorded. In-game delivery depends on server socket integration.' });
  } catch (err) {
    console.error('[server/broadcast]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
