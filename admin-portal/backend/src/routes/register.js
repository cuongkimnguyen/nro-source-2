import { Router } from 'express';
import pool from '../db.js';
import { getClientIp } from '../core/ip.js';

const router = Router();

// Username: 4-32 chars, letters/digits/underscore/dot/hyphen only
const USERNAME_RE = /^[a-zA-Z0-9_.-]{4,32}$/;
const MAX_ACCOUNTS_PER_IP = 2;

/**
 * POST /api/register
 *
 * Public endpoint. Creates a new game account in the `account` table.
 *
 * Rules enforced (in order):
 *   1. Input validation (schema + regex)
 *   2. Password confirmation match
 *   3. Username uniqueness
 *   4. IP registration limit (max 2 per IP, no bypass)
 *   5. Insert account
 */
router.post('/', async (req, res) => {
  const { username: rawUsername, password, retypePassword } = req.body ?? {};

  // ── 1. Basic presence check ────────────────────────────────────────────────
  if (
    typeof rawUsername !== 'string' ||
    typeof password !== 'string' ||
    typeof retypePassword !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'username, password, and retypePassword are required' },
    });
  }

  const username = rawUsername.trim();

  // ── 2. Format validation ───────────────────────────────────────────────────
  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_USERNAME',
        message: 'Username must be 4-32 characters and contain only letters, digits, _ . -',
      },
    });
  }

  if (password.length < 4 || password.length > 64) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_PASSWORD', message: 'Password must be between 4 and 64 characters' },
    });
  }

  // ── 3. Password confirmation ───────────────────────────────────────────────
  if (password !== retypePassword) {
    return res.status(400).json({
      success: false,
      error: { code: 'PASSWORD_NOT_MATCH', message: 'Password confirmation does not match' },
    });
  }

  try {
    // ── 4. Duplicate username check ──────────────────────────────────────────
    const [existingRows] = await pool.execute(
      'SELECT id FROM `account` WHERE `username` = ? LIMIT 1',
      [username]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'USERNAME_EXISTS', message: 'Username already exists' },
      });
    }

    // ── 5. IP registration limit ─────────────────────────────────────────────
    const clientIp = getClientIp(req);

    const [countRows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM `account` WHERE `register_ip` = ?',
      [clientIp]
    );

    const ipCount = Number(countRows[0]?.total ?? 0);

    if (ipCount >= MAX_ACCOUNTS_PER_IP) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'IP_REGISTER_LIMIT_EXCEEDED',
          message: 'This IP address has reached the account registration limit',
        },
      });
    }

    // ── 6. Insert account ────────────────────────────────────────────────────
    // Legacy compatibility:
    // The current game server login logic expects plain-text passwords in the account table.
    // Do not hash this value unless the game server authentication logic is migrated too.
    await pool.execute(
      `INSERT INTO \`account\`
         (\`username\`, \`password\`, \`email\`, \`token\`, \`xsrf_token\`, \`newpass\`, \`register_ip\`)
       VALUES (?, ?, '', '', '', '', ?)`,
      [username, password, clientIp]
    );

    return res.status(201).json({
      success: true,
      message: 'Register account successfully',
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Internal server error' },
    });
  }
});

export default router;
