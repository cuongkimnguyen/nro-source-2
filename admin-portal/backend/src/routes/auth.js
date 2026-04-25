import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';
import { writeAuditLog } from '../middleware/auditLog.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, username, password, role, is_active FROM admin_portal_users WHERE username = ? LIMIT 1',
      [username]
    );

    const user = rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await pool.execute(
      'UPDATE admin_portal_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await writeAuditLog({
      adminUsername: user.username,
      action: 'login',
      ip: req.ip,
    });

    return res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout  (client drops token; server records audit)
import { requireAuth } from '../middleware/auth.js';

router.post('/logout', requireAuth, async (req, res) => {
  await writeAuditLog({
    adminUsername: req.admin.username,
    action: 'logout',
    ip: req.ip,
  });
  return res.json({ ok: true });
});

export default router;
