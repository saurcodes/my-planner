import { db } from '../database/connection';
import {
  FocusSession,
  FocusSessionStatus,
  StartFocusSessionResponse,
} from '@time-management/shared';
import { authService } from './auth.service';

class FocusService {
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    const rows = await db.query<any>(
      'SELECT * FROM focus_sessions WHERE user_id = $1 ORDER BY start_time DESC LIMIT 50',
      [userId]
    );
    return rows.map(this.mapRowToSession);
  }

  async getActiveSession(userId: string): Promise<FocusSession | null> {
    const rows = await db.query<any>(
      'SELECT * FROM focus_sessions WHERE user_id = $1 AND status = $2 ORDER BY start_time DESC LIMIT 1',
      [userId, FocusSessionStatus.ACTIVE]
    );
    return rows.length > 0 ? this.mapRowToSession(rows[0]) : null;
  }

  async startSession(userId: string, taskId?: string): Promise<StartFocusSessionResponse> {
    // End any active sessions first
    await db.query(
      'UPDATE focus_sessions SET status = $1, end_time = CURRENT_TIMESTAMP WHERE user_id = $2 AND status = $3',
      [FocusSessionStatus.CANCELLED, userId, FocusSessionStatus.ACTIVE]
    );

    // Create new session
    const row = await db.query<any>(
      `INSERT INTO focus_sessions (user_id, task_id, start_time, status)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3)
       RETURNING *`,
      [userId, taskId || null, FocusSessionStatus.ACTIVE]
    );

    const session = this.mapRowToSession(row[0]);

    // Get user settings for blocked websites and pomodoro
    const user = await authService.getUserById(userId);

    return {
      session,
      blockedWebsites: user.settings.focusMode.blockedWebsites,
      pomodoroSettings: user.settings.pomodoroSettings,
    };
  }

  async endSession(
    id: string,
    userId: string,
    updates: { productivityScore?: number; notes?: string }
  ): Promise<FocusSession | null> {
    const rows = await db.query<any>(
      `UPDATE focus_sessions
       SET status = $1, end_time = CURRENT_TIMESTAMP, productivity_score = $2, notes = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [FocusSessionStatus.COMPLETED, updates.productivityScore || null, updates.notes || null, id, userId]
    );
    return rows.length > 0 ? this.mapRowToSession(rows[0]) : null;
  }

  async pauseSession(id: string, userId: string): Promise<FocusSession | null> {
    const rows = await db.query<any>(
      `UPDATE focus_sessions SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [FocusSessionStatus.PAUSED, id, userId]
    );
    return rows.length > 0 ? this.mapRowToSession(rows[0]) : null;
  }

  async resumeSession(id: string, userId: string): Promise<FocusSession | null> {
    const rows = await db.query<any>(
      `UPDATE focus_sessions SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [FocusSessionStatus.ACTIVE, id, userId]
    );
    return rows.length > 0 ? this.mapRowToSession(rows[0]) : null;
  }

  async getBlockedSites(userId: string): Promise<string[]> {
    const user = await authService.getUserById(userId);
    return user.settings.focusMode.blockedWebsites;
  }

  async updateBlockedSites(userId: string, websites: string[]): Promise<void> {
    await db.query(
      `UPDATE users
       SET settings = jsonb_set(settings, '{focusMode,blockedWebsites}', $1::jsonb)
       WHERE id = $2`,
      [JSON.stringify(websites), userId]
    );
  }

  private mapRowToSession(row: any): FocusSession {
    return {
      id: row.id,
      userId: row.user_id,
      taskId: row.task_id,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      breaks: row.breaks || [],
      productivityScore: row.productivity_score,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const focusService = new FocusService();
