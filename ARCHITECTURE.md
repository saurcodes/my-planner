# TimeFlow - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────┐
│          Client Applications                     │
├──────────────┬──────────────┬───────────────────┤
│  React Web   │ React Native │  Electron Desktop │
│  (Port 3000) │   (Mobile)   │   (Standalone)    │
└──────────────┴──────────────┴───────────────────┘
                      ↓
              REST API / WebSocket
                      ↓
┌─────────────────────────────────────────────────┐
│         Express API Server (Port 3001)           │
├─────────────────────────────────────────────────┤
│  Authentication │ Authorization │ Validation     │
├─────────────────────────────────────────────────┤
│              Route Handlers                      │
│  /auth │ /tasks │ /planning │ /focus │ /analytics│
├─────────────────────────────────────────────────┤
│              Controllers                         │
│  Business Logic Orchestration                    │
├─────────────────────────────────────────────────┤
│              Services                            │
│  • Task Service    • Planning Service            │
│  • Auth Service    • Focus Service               │
│  • Claude AI       • Analytics Service           │
│  • Reminder        • Tag Service                 │
└─────────────────────────────────────────────────┘
                      ↓
┌──────────────────┬──────────────┬──────────────┐
│   PostgreSQL     │    Redis     │  Claude API  │
│  (Primary DB)    │  (Cache/Queue)│ (AI Service) │
└──────────────────┴──────────────┴──────────────┘
```

## Technology Stack

### Frontend (Web)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (fast dev server, optimized builds)
- **Styling:** TailwindCSS (utility-first CSS)
- **State Management:** Zustand (lightweight, simple)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL 14+
- **Cache/Queue:** Redis
- **Authentication:** Passport.js (Google OAuth 2.0)
- **JWT:** jsonwebtoken
- **Validation:** express-validator
- **Security:** Helmet, CORS
- **Logging:** Winston
- **AI Integration:** Anthropic Claude SDK

### Shared
- **Language:** TypeScript
- **Type Definitions:** Shared across all packages
- **Utilities:** Date handling, task calculations

### Infrastructure
- **Monorepo:** pnpm workspaces
- **Package Manager:** pnpm (fast, disk-efficient)
- **Version Control:** Git
- **Environment:** dotenv

## Database Schema

### Tables

#### users
- id (UUID, PK)
- email (unique)
- name
- oauth_provider ('google' | 'apple')
- oauth_id
- settings (JSONB - user preferences)
- created_at, updated_at

#### tasks
- id (UUID, PK)
- user_id (FK → users)
- title
- description
- urgency (1-10)
- importance (1-10)
- quadrant (calculated)
- priority (calculated)
- status ('todo' | 'in_progress' | 'completed' | 'cancelled')
- estimated_minutes
- deadline
- scheduled_for
- tags (JSONB array)
- created_at, updated_at, completed_at

#### focus_sessions
- id (UUID, PK)
- user_id (FK → users)
- task_id (FK → tasks, nullable)
- start_time, end_time
- status ('active' | 'paused' | 'completed' | 'cancelled')
- breaks (JSONB array)
- productivity_score (0-100)
- notes
- created_at, updated_at

#### reminders
- id (UUID, PK)
- task_id (FK → tasks)
- user_id (FK → users)
- reminder_time
- type ('push' | 'in_app')
- status ('pending' | 'sent' | 'failed')
- sent_at, created_at

#### daily_analytics
- id (UUID, PK)
- user_id (FK → users)
- date (unique with user_id)
- tasks_completed
- tasks_created
- focus_time_minutes
- quadrant_distribution (JSONB)
- productivity_score (0-100)
- created_at

#### ai_insights
- id (UUID, PK)
- user_id (FK → users)
- type (enum: productivity_pattern, time_management, etc.)
- title, description, recommendation
- created_at

#### tags
- id (UUID, PK)
- user_id (FK → users)
- name (unique with user_id)
- color (hex code)
- created_at, updated_at

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Tasks
- `GET /tasks` - List tasks (with filters)
- `GET /tasks/matrix` - Get Eisenhower matrix
- `GET /tasks/:id` - Get single task
- `POST /tasks` - Create task
- `POST /tasks/voice` - Create from voice
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Planning
- `GET /planning/questions` - Get daily planning questions
- `POST /planning/daily` - Generate daily plan (AI)
- `GET /planning/daily/current` - Get current plan
- `PUT /planning/daily/:id` - Update plan

### Focus Mode
- `POST /focus/start` - Start focus session
- `GET /focus/active` - Get active session
- `PUT /focus/:id/end` - End session
- `PUT /focus/:id/pause` - Pause session
- `PUT /focus/:id/resume` - Resume session
- `GET /focus/blocked-sites` - Get blocked sites
- `PUT /focus/blocked-sites` - Update blocked sites

### Analytics
- `GET /analytics/trends` - Productivity trends
- `GET /analytics/time-tracking` - Time tracking data
- `GET /analytics/insights` - AI insights
- `POST /analytics/insights/generate` - Generate new insights

### Reminders
- `GET /reminders` - List reminders
- `GET /reminders/upcoming` - Upcoming reminders
- `POST /reminders` - Create reminder
- `PUT /reminders/:id` - Update reminder
- `DELETE /reminders/:id` - Delete reminder

### Tags
- `GET /tags` - List tags
- `POST /tags` - Create tag
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

## Core Algorithms

### Eisenhower Matrix Categorization

```typescript
function calculateQuadrant(urgency: number, importance: number): TaskQuadrant {
  const isUrgent = urgency >= 6;
  const isImportant = importance >= 6;

  if (isUrgent && isImportant) return 'urgent_important';      // Do First
  if (!isUrgent && isImportant) return 'not_urgent_important'; // Schedule
  if (isUrgent && !isImportant) return 'urgent_not_important'; // Delegate
  return 'not_urgent_not_important';                           // Eliminate
}
```

### Auto-Urgency Calculation

```typescript
function calculateUrgencyFromDeadline(deadline?: Date): number {
  if (!deadline) return 3; // Default low urgency

  const daysUntil = getDaysUntil(deadline);

  if (daysUntil <= 0) return 10;  // Overdue
  if (daysUntil <= 1) return 9;   // Due tomorrow
  if (daysUntil <= 2) return 8;   // 2 days
  if (daysUntil <= 3) return 7;   // 3 days
  if (daysUntil <= 7) return 6;   // This week
  if (daysUntil <= 14) return 5;  // Next 2 weeks
  if (daysUntil <= 30) return 4;  // This month
  return 3;                        // Future
}
```

## AI Integration (Claude)

### Daily Planning Workflow

1. User answers 5-7 questions about their day
2. System gathers existing tasks
3. Claude analyzes:
   - User's energy level
   - Available time
   - Priorities
   - Existing commitments
   - Deadlines
4. Claude generates:
   - New task suggestions
   - Optimized schedule with breaks
   - Time blocks (work/focus/break)
   - Productivity insights

### AI Insights Generation

Claude analyzes:
- Task completion patterns
- Quadrant distribution
- Focus session data
- Time tracking metrics

Generates insights on:
- Productivity patterns
- Time management effectiveness
- Focus improvement suggestions
- Task prioritization habits
- Work-life balance

## Security

### Authentication Flow

1. User clicks "Login with Google"
2. Redirected to Google OAuth consent
3. Google redirects back with auth code
4. Backend exchanges code for user info
5. Create/retrieve user from database
6. Generate JWT token
7. Return token to frontend
8. Store token in localStorage
9. Include token in all API requests

### Authorization

- All protected routes use `authenticateToken` middleware
- JWT verified on each request
- User ID extracted from token
- Data access restricted to user's own resources

### Security Headers

- Helmet.js for security headers
- CORS configured for specific origins
- Input validation on all endpoints
- SQL injection prevention via parameterized queries

## State Management (Frontend)

### Zustand Stores

**authStore:**
- token
- isAuthenticated
- setToken()
- logout()

**taskStore:**
- tasks[]
- matrix
- loading
- fetchTasks()
- fetchMatrix()
- addTask()
- updateTask()
- removeTask()

## Performance Considerations

### Backend
- Connection pooling for PostgreSQL
- Redis caching for frequently accessed data
- Indexed database queries
- Async/await for non-blocking operations

### Frontend
- Code splitting per route
- Lazy loading components
- Optimized re-renders with Zustand
- Memoization where needed

### Database
- Indexes on:
  - user_id (all tables)
  - task status, quadrant, deadline
  - reminder time and status
  - focus session start time
  - analytics date

## Future Enhancements

1. **WebSocket Integration**
   - Real-time task updates
   - Live focus session sync
   - Push notifications

2. **Background Jobs**
   - Automated reminder sending
   - Daily analytics calculation
   - Periodic AI insights generation

3. **Caching Strategy**
   - Redis for session storage
   - Task list caching
   - Matrix view caching

4. **Monitoring**
   - Application metrics
   - Error tracking (Sentry)
   - Performance monitoring
   - API usage analytics
