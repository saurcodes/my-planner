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
COPY web/ ./web/

# Install dependencies for all workspaces
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# Build shared package first
RUN pnpm --filter shared build

# Build argument for API URL
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

# Build web app
RUN pnpm --filter web build

# Production stage
FROM nginx:alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built files from builder
COPY --from=builder /app/web/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
