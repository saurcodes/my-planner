-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  oauth_provider VARCHAR(50) NOT NULL CHECK (oauth_provider IN ('google', 'apple')),
  oauth_id VARCHAR(255) NOT NULL,
  settings JSONB DEFAULT '{
    "timezone": "UTC",
    "workingHours": {"start": "09:00", "end": "17:00"},
    "breakDuration": 15,
    "pomodoroSettings": {
      "workDuration": 25,
      "shortBreak": 5,
      "longBreak": 15,
      "sessionsBeforeLongBreak": 4
    },
    "notifications": {
      "enabled": true,
      "reminderMinutesBefore": 15,
      "focusModeNotifications": false
    },
    "focusMode": {
      "blockedWebsites": [],
      "autoEnableForUrgentImportant": true
    }
  }'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(oauth_provider, oauth_id)
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  urgency INTEGER NOT NULL DEFAULT 5 CHECK (urgency >= 1 AND urgency <= 10),
  importance INTEGER NOT NULL DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  quadrant VARCHAR(50) NOT NULL CHECK (quadrant IN ('urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
  estimated_minutes INTEGER,
  deadline TIMESTAMP,
  scheduled_for TIMESTAMP,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('push', 'in_app')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Focus sessions table
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  breaks JSONB DEFAULT '[]'::jsonb,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily analytics table
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  tasks_created INTEGER DEFAULT 0,
  focus_time_minutes INTEGER DEFAULT 0,
  quadrant_distribution JSONB DEFAULT '{
    "urgentImportant": 0,
    "notUrgentImportant": 0,
    "urgentNotImportant": 0,
    "notUrgentNotImportant": 0
  }'::jsonb,
  productivity_score INTEGER CHECK (productivity_score >= 0 AND productivity_score <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- AI insights table
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('productivity_pattern', 'time_management', 'focus_improvement', 'task_prioritization', 'work_life_balance')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_quadrant ON tasks(quadrant);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_scheduled_for ON tasks(scheduled_for);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_reminder_time ON reminders(reminder_time);
CREATE INDEX idx_reminders_status ON reminders(status);

CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX idx_focus_sessions_status ON focus_sessions(status);
CREATE INDEX idx_focus_sessions_start_time ON focus_sessions(start_time);

CREATE INDEX idx_daily_analytics_user_id ON daily_analytics(user_id);
CREATE INDEX idx_daily_analytics_date ON daily_analytics(date);

CREATE INDEX idx_tags_user_id ON tags(user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_focus_sessions_updated_at BEFORE UPDATE ON focus_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
