FROM node:18-alpine AS builder

WORKDIR /app

# Install all deps (including devDeps for build)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# ---- Production image ----
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Production deps only
RUN npm ci --only=production && npx prisma generate

# Copy built files
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
