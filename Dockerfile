# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Install openssl + ca-certs for Prisma on Alpine
RUN apk add --no-cache openssl openssl-dev ca-certificates

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL deps (need tsc + prisma CLI)
RUN npm ci

# Generate Prisma client with correct Alpine binary
RUN npx prisma generate

COPY . .
RUN npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:18-alpine AS runner

# Same openssl needed at RUNTIME by the Prisma query engine
RUN apk add --no-cache openssl ca-certificates

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Production deps only, then regenerate Prisma client for this image
RUN npm ci --only=production && npx prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
