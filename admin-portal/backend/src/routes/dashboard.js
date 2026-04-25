import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard
router.get('/', requireAuth, async (_req, res) => {
  try {
    const [[{ totalAccounts }]] = await pool.execute(
      'SELECT COUNT(*) AS totalAccounts FROM account'
    );
    const [[{ totalPlayers }]] = await pool.execute(
      'SELECT COUNT(*) AS totalPlayers FROM player'
    );
    const [[{ onlinePlayers }]] = await pool.execute(
      'SELECT COUNT(*) AS onlinePlayers FROM account WHERE server_login >= 0'
    );
    const [[{ bannedAccounts }]] = await pool.execute(
      'SELECT COUNT(*) AS bannedAccounts FROM account WHERE ban = 1'
    );
    const [[{ totalPayments }]] = await pool.execute(
      'SELECT COALESCE(SUM(final_credited_amount), 0) AS totalPayments FROM payments WHERE is_credited = 1'
    );
    const [[{ pendingPayments }]] = await pool.execute(
      'SELECT COUNT(*) AS pendingPayments FROM payments WHERE is_credited = 0'
    );

    // Server status from adminpanel table
    const [serverRows] = await pool.execute(
      'SELECT trangthai, tenmaychu FROM adminpanel LIMIT 1'
    );
    const server = serverRows[0] ?? { trangthai: 'unknown', tenmaychu: 'NRO Server' };

    // Recent 5 audit log entries
    const [recentAudit] = await pool.execute(
      'SELECT admin_username, action, target_type, target_id, created_at FROM admin_audit_log ORDER BY created_at DESC LIMIT 5'
    );

    return res.json({
      totalAccounts,
      totalPlayers,
      onlinePlayers,
      bannedAccounts,
      totalPayments,
      pendingPayments,
      server,
      recentAudit,
    });
  } catch (err) {
    console.error('[dashboard]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
