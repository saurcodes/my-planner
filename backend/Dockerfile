# Build stage
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml* ./

# Copy all workspace packages
COPY shared/ ./shared/
COPY backend/ ./backend/

# Install dependencies for all workspaces
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# Build shared package first
RUN pnpm --filter shared build

# Build backend
RUN pnpm --filter backend build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8

# Install wget for healthcheck
RUN apk add --no-cache wget

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml* ./

# Copy package.json files for workspace resolution
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

# Install production dependencies only
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --prod; else pnpm install --prod; fi

# Copy built files from builder
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Copy database migrations
COPY backend/src/database/migrations ./backend/src/database/migrations

# Expose port
EXPOSE 3001

# Set working directory to backend
WORKDIR /app/backend

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the server
CMD ["node", "dist/server.js"]
