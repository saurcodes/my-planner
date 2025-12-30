# Docker Setup Guide

This guide explains how to run the Time Management application using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+ installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 2.0+ installed (included with Docker Desktop)
- At least 4GB of RAM available for Docker
- Ports 3000, 3001, 5432, and 6379 available on your machine

## Quick Start

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.docker.example .env
```

Edit `.env` and set the required values:
- `JWT_SECRET`: A strong random secret key
- `DB_PASSWORD`: A secure PostgreSQL password
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `ANTHROPIC_API_KEY`: Your Claude API key

### 2. Build and Start All Services

```bash
docker compose up -d
```

This command will:
- Build the backend and frontend Docker images
- Start PostgreSQL, Redis, Backend, and Frontend containers
- Create necessary networks and volumes

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 4. Run Database Migrations

After the containers are running, execute the migrations:

```bash
docker compose exec backend pnpm migrate
```

Optionally, seed the database with test data:

```bash
docker compose exec backend pnpm seed
```

## Container Architecture

The application consists of 4 services:

### 1. PostgreSQL (`postgres`)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: pg_isready
- Database migrations are located in `backend/src/database/migrations/`

### 2. Redis (`redis`)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: `redis_data` (persistent storage)
- **Health Check**: redis-cli ping
- Used for caching and job queues (Bull)

### 3. Backend API (`backend`)
- **Build**: Node.js 18-alpine multi-stage build
- **Port**: 3001
- **Dependencies**: PostgreSQL, Redis
- **Health Check**: HTTP GET /health
- Runs TypeScript compiled Node.js/Express server

### 4. Frontend Web (`web`)
- **Build**: Node.js 18 build + Nginx alpine
- **Port**: 3000 (mapped to container port 80)
- **Dependencies**: Backend
- **Health Check**: HTTP GET /
- Serves static React build via Nginx

## Common Commands

### Starting Services

```bash
# Start all services in background
docker compose up -d

# Start specific service
docker compose up -d backend

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes all data)
docker compose down -v

# Stop specific service
docker compose stop backend
```

### Rebuilding

```bash
# Rebuild all images
docker compose build

# Rebuild specific service
docker compose build backend

# Rebuild and start (no cache)
docker compose up -d --build --force-recreate
```

### Database Operations

```bash
# Run migrations
docker compose exec backend pnpm migrate

# Rollback last migration
docker compose exec backend pnpm migrate:down

# Seed database
docker compose exec backend pnpm seed

# Access PostgreSQL CLI
docker compose exec postgres psql -U postgres -d time_management

# Backup database
docker compose exec postgres pg_dump -U postgres time_management > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres time_management < backup.sql
```

### Redis Operations

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Monitor Redis commands
docker compose exec redis redis-cli MONITOR

# View all keys
docker compose exec redis redis-cli KEYS '*'

# Flush all Redis data
docker compose exec redis redis-cli FLUSHALL
```

### Debugging

```bash
# Shell access to backend container
docker compose exec backend sh

# Shell access to frontend container
docker compose exec web sh

# View backend logs with timestamps
docker compose logs -f --timestamps backend

# Inspect container
docker inspect time-management-backend

# View resource usage
docker stats
```

## Development vs Production

### Development Mode

For development with hot reload, use the standard `pnpm dev` commands instead of Docker:

```bash
pnpm install
pnpm dev:backend   # Backend with tsx watch
pnpm dev:web       # Frontend with Vite HMR
```

You can still use Docker for just the database and Redis:

```bash
# Start only database services
docker compose up -d postgres redis
```

### Production Mode

The Docker setup is optimized for production:
- Multi-stage builds for smaller images
- Production-only dependencies
- Nginx for efficient static file serving
- Health checks for all services
- Automatic restart policies

## Environment Variables

### Required Variables

- `JWT_SECRET`: Secret for JWT token signing
- `DB_PASSWORD`: PostgreSQL password
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `ANTHROPIC_API_KEY`: Claude API key

### Optional Variables

- `REDIS_PASSWORD`: Redis authentication (empty by default)
- `APPLE_*`: Apple OAuth credentials
- `FCM_SERVER_KEY`: Firebase Cloud Messaging key
- `LOG_LEVEL`: Logging level (default: info)

See `.env.docker.example` for the complete list.

## Networking

All services communicate through a custom bridge network: `time-management-network`

Service DNS names (use these for inter-service communication):
- `postgres` - PostgreSQL database
- `redis` - Redis cache/queue
- `backend` - Backend API
- `web` - Frontend web app

## Volumes

Persistent data is stored in Docker volumes:

```bash
# List volumes
docker volume ls | grep time-management

# Inspect volume
docker volume inspect time-management_postgres_data

# Remove volumes (WARNING: deletes all data)
docker volume rm time-management_postgres_data
docker volume rm time-management_redis_data
```

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Find process using port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Change ports in .env file
WEB_PORT=3100
PORT=3101
DB_PORT=5433
```

### Backend Won't Start

1. Check if PostgreSQL is healthy:
```bash
docker compose ps
docker compose logs postgres
```

2. Verify database connection:
```bash
docker compose exec postgres psql -U postgres -d time_management
```

3. Check environment variables:
```bash
docker compose exec backend env | grep DB_
```

### Frontend Can't Connect to Backend

1. Verify backend is running:
```bash
curl http://localhost:3001/health
```

2. Check VITE_API_URL in build:
```bash
docker compose build web --no-cache --build-arg VITE_API_URL=http://localhost:3001
```

### Database Migration Failures

```bash
# Check migration status
docker compose exec backend pnpm migrate

# View database logs
docker compose logs postgres

# Manually run migrations
docker compose exec postgres psql -U postgres -d time_management -f /docker-entrypoint-initdb.d/001_initial_schema.sql
```

### Container Crashes

```bash
# View exit code and reason
docker compose ps -a

# View recent logs
docker compose logs --tail=100 backend

# Restart specific service
docker compose restart backend
```

## Performance Optimization

### Reduce Build Time

Use BuildKit for faster builds:

```bash
DOCKER_BUILDKIT=1 docker compose build
```

### Limit Resource Usage

Edit `docker-compose.yml` to add resource limits:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### Clean Up Old Images

```bash
# Remove unused images
docker image prune -a

# Remove all unused data
docker system prune -a --volumes
```

## Security Considerations

1. **Never commit `.env` file** - It contains secrets
2. **Change default passwords** - Use strong, random passwords
3. **Use secrets in production** - Consider Docker secrets or external secret managers
4. **Keep images updated** - Regularly rebuild with latest base images
5. **Scan for vulnerabilities**:
   ```bash
   docker scan time-management-backend
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build images
        run: docker compose build
      - name: Run tests
        run: docker compose run backend pnpm test
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review logs: `docker compose logs`
3. Verify environment variables in `.env`
4. Ensure all required ports are available
5. Try rebuilding: `docker compose build --no-cache`
