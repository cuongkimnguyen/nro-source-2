# ─── Stage 1: Build React frontend ───────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

COPY admin-portal/frontend/package*.json ./
RUN npm ci --prefer-offline

COPY admin-portal/frontend/ ./
RUN npm run build          # → /frontend/dist

# ─── Stage 2: Install backend prod deps ──────────────────────────────────────
FROM node:20-alpine AS backend-deps
WORKDIR /app

COPY admin-portal/backend/package*.json ./
RUN npm ci --omit=dev --prefer-offline

# ─── Stage 3: Final runtime image ────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copy backend source
COPY admin-portal/backend/ ./

# Replace dev node_modules with prod-only
COPY --from=backend-deps /app/node_modules ./node_modules

# Embed the built frontend into ./public (Express will serve it)
COPY --from=frontend-builder /frontend/dist ./public

EXPOSE 4000

CMD ["node", "src/app.js"]
