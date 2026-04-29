import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import authRouter      from './routes/auth.js';
import registerRouter  from './routes/register.js';
import dashboardRouter from './routes/dashboard.js';
import playersRouter   from './routes/players.js';
import giftcodesRouter from './routes/giftcodes.js';
import serverRouter    from './routes/server.js';
import auditLogRouter  from './routes/auditLog.js';
import paymentsRouter  from './routes/payments.js';
import buffLogRouter   from './routes/buffLog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// In Docker the built React app is copied to ./public (relative to /app)
const publicDir = path.join(__dirname, '..', 'public');
const serveStatic = existsSync(publicDir);

const app = express();

app.set('trust proxy', 1);
app.use(helmet({
  // Allow inline scripts/styles from React build
  contentSecurityPolicy: serveStatic ? false : undefined,
}));

// CORS only needed in local dev when frontend runs on a different port.
// In Docker the React build is served by Express itself — same origin, no CORS needed.
if (!serveStatic && process.env.FRONTEND_ORIGIN) {
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }));
} else if (!serveStatic) {
  // Dev fallback
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }));
}

app.use(express.json({ limit: '1mb' }));

// ── API routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',      authRouter);
app.use('/api/register',  registerRouter); // public — no auth required
app.use('/api/dashboard', dashboardRouter);
app.use('/api/players',   playersRouter);
app.use('/api/giftcodes', giftcodesRouter);
app.use('/api/server',    serverRouter);
app.use('/api/audit-log', auditLogRouter);
app.use('/api/payments',  paymentsRouter);
app.use('/api/buff-log',  buffLogRouter);

// Health check (useful for Docker healthcheck)
app.get('/health', (_req, res) => res.json({ ok: true }));

// ── Serve React SPA (production / Docker) ───────────────────────────────────
if (serveStatic) {
  app.use(express.static(publicDir));
  // SPA fallback — any non-API path gets index.html
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// 404 (API routes only reach here if serveStatic is false)
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Generic error handler
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`NRO Admin Portal listening on http://0.0.0.0:${PORT} (static=${serveStatic})`);
});

export default app;
