# Time Management App

AI-powered time management application with Eisenhower matrix, focus mode, and intelligent daily planning.

## Features

- **AI-Powered Planning**: Question-based daily planning using Claude AI
- **Eisenhower Matrix**: Auto-categorize tasks by urgency and importance
- **Smart Reminders**: Push notifications and in-app alerts
- **Focus Mode**: Website blocking, Pomodoro timer, and productivity analytics
- **Cross-Platform**: Web, mobile (iOS/Android), and desktop (macOS/Windows/Linux)
- **Analytics Dashboard**: Track productivity trends and get AI-powered insights

## Tech Stack

- **Frontend**: React, React Native, Electron
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API
- **Authentication**: OAuth 2.0 (Google, Apple)

## Project Structure

```
time-management/
├── backend/          # Express API server
├── web/             # React web application
├── mobile/          # React Native mobile app
├── desktop/         # Electron desktop app
├── shared/          # Shared types and utilities
└── package.json     # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14

### Installation

```bash
# Install all dependencies
pnpm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Run database migrations
pnpm --filter backend migrate

# Start development servers
pnpm dev:backend    # API server
pnpm dev:web        # Web app
```

## Development

```bash
# Run specific workspace
pnpm --filter backend dev
pnpm --filter web dev
pnpm --filter mobile dev
pnpm --filter desktop dev

# Build for production
pnpm build:backend
pnpm build:web
pnpm build:mobile
pnpm build:desktop
```

## License

MIT
