import pool from '../db.js';

/**
 * Write one row to admin_audit_log.
 * Call from route handlers after a state-changing action.
 *
 * @param {object} opts
 * @param {string} opts.adminUsername
 * @param {string} opts.action        e.g. 'ban_account'
 * @param {string} [opts.targetType]  e.g. 'account'
 * @param {string|number} [opts.targetId]
 * @param {object} [opts.before]
 * @param {object} [opts.after]
 * @param {string} [opts.ip]
 */
export async function writeAuditLog({ adminUsername, action, targetType, targetId, before, after, ip }) {
  try {
    await pool.execute(
      `INSERT INTO admin_audit_log
         (admin_username, action, target_type, target_id, before_payload, after_payload, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adminUsername,
        action,
        targetType ?? null,
        targetId != null ? String(targetId) : null,
        before != null ? JSON.stringify(before) : null,
        after  != null ? JSON.stringify(after)  : null,
        ip ?? null,
      ]
    );
  } catch (err) {
    // Audit log failure must not break the response — log to stderr only
    console.error('[audit_log] write failed:', err.message);
  }
}
