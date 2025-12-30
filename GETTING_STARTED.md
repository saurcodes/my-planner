# Getting Started with TimeFlow

This guide will help you set up and run the TimeFlow application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **PostgreSQL** >= 14
- **Redis** (optional, for reminders and caching)

## Quick Start

### 1. Install Dependencies

```bash
# Install all packages in the monorepo
pnpm install
```

### 2. Set Up PostgreSQL Database

```bash
# Create database
createdb time_management

# Or using psql
psql -U postgres
CREATE DATABASE time_management;
\q
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration
nano backend/.env
```

**Required environment variables:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=time_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Run Database Migrations

```bash
pnpm --filter backend migrate
```

### 5. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
pnpm dev:backend
```

**Terminal 2 - Web Frontend:**
```bash
pnpm dev:web
```

### 6. Access the Application

- **Web App:** http://localhost:3000
- **API Server:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Detailed Setup

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copy Client ID and Client Secret to `.env` file

### Getting Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key to `.env` as `ANTHROPIC_API_KEY`

### Optional: Redis Setup

For reminder system and caching:

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Update .env
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Project Structure

```
time-management/
├── backend/              # Express API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── database/     # DB connection & migrations
│   │   └── config/       # Configuration
│   └── package.json
│
├── web/                  # React web application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   └── lib/          # API client & utilities
│   └── package.json
│
├── shared/               # Shared TypeScript types
│   └── src/types/
│
├── mobile/               # React Native (placeholder)
├── desktop/              # Electron app (placeholder)
└── package.json          # Root package.json
```

## Available Scripts

### Monorepo Commands

```bash
# Install all dependencies
pnpm install

# Start backend dev server
pnpm dev:backend

# Start web dev server
pnpm dev:web

# Build backend
pnpm build:backend

# Build web app
pnpm build:web

# Clean all
pnpm clean
```

### Backend Commands

```bash
cd backend

# Run migrations
pnpm migrate

# Start dev server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Web Commands

```bash
cd web

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Features Overview

### ✅ Implemented

1. **Eisenhower Matrix**
   - Auto-categorization of tasks by urgency/importance
   - Visual matrix view with 4 quadrants
   - Drag-and-drop (UI ready, handlers pending)

2. **Task Management**
   - Create, read, update, delete tasks
   - Auto-calculation of urgency from deadlines
   - Tag support for organization
   - Task status tracking

3. **OAuth Authentication**
   - Google OAuth 2.0
   - JWT token-based auth
   - Secure session management

4. **AI Planning (Claude)**
   - Daily planning questionnaire
   - AI-generated task suggestions
   - Smart scheduling
   - Productivity insights

5. **Focus Mode (Backend Ready)**
   - Pomodoro timer support
   - Focus session tracking
   - Website blocking configuration
   - Productivity scoring

6. **Analytics (Backend Ready)**
   - Productivity trends
   - Time tracking
   - AI-generated insights
   - Quadrant distribution

7. **Reminder System (Backend Ready)**
   - Push notification support
   - In-app reminders
   - Customizable reminder times

### 🚧 Pending UI Implementation

- Daily planning questionnaire UI
- Focus mode timer UI
- Analytics dashboards
- Voice input for tasks
- Task creation modal
- Tag management UI

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
# macOS
brew services restart postgresql

# Ubuntu/Debian
sudo systemctl restart postgresql
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
pnpm clean
pnpm install
```

## Next Steps

1. **Complete UI Implementation**
   - Planning questionnaire interface
   - Focus mode with Pomodoro timer
   - Analytics dashboards

2. **Mobile App**
   - Set up React Native
   - Implement core features
   - Push notifications

3. **Desktop App**
   - Electron wrapper
   - Native website blocking
   - System tray integration

4. **Testing**
   - Unit tests for services
   - Integration tests for APIs
   - E2E tests for critical flows

5. **Deployment**
   - Docker containers
   - CI/CD pipeline
   - Production hosting

## Support

For issues or questions:
- Check the README.md
- Review the API documentation
- Check backend logs: `backend/logs/`

## License

MIT
