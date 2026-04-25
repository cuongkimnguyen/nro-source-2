/**
 * Extract the real client IP from an Express request.
 *
 * Priority:
 *   1. First entry of x-forwarded-for (when Express trust proxy is enabled)
 *   2. req.ip (Express resolved IP)
 *   3. req.socket.remoteAddress
 *
 * IPv6-mapped IPv4 addresses (::ffff:x.x.x.x) are normalised to plain IPv4.
 *
 * NOTE: app.set('trust proxy', 1) must be configured in app.js for
 * x-forwarded-for to be trustworthy behind a reverse proxy / Nginx.
 */
export function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim().replace(/^::ffff:/, '');
  }

  return (req.ip || req.socket?.remoteAddress || 'unknown').replace(/^::ffff:/, '');
}
