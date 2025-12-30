import { db } from '../database/connection';
import {
  Reminder,
  CreateReminderDTO,
  UpdateReminderDTO,
  ReminderStatus,
} from '@time-management/shared';

class ReminderService {
  async getReminders(userId: string): Promise<Reminder[]> {
    const rows = await db.query<any>(
      'SELECT * FROM reminders WHERE user_id = $1 ORDER BY reminder_time ASC',
      [userId]
    );
    return rows.map(this.mapRowToReminder);
  }

  async getUpcomingReminders(userId: string): Promise<Reminder[]> {
    const rows = await db.query<any>(
      `SELECT * FROM reminders
       WHERE user_id = $1 AND status = $2 AND reminder_time > CURRENT_TIMESTAMP
       ORDER BY reminder_time ASC
       LIMIT 10`,
      [userId, ReminderStatus.PENDING]
    );
    return rows.map(this.mapRowToReminder);
  }

  async createReminder(userId: string, data: CreateReminderDTO): Promise<Reminder> {
    const row = await db.query<any>(
      `INSERT INTO reminders (task_id, user_id, reminder_time, type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.taskId, userId, data.reminderTime, data.type]
    );
    return this.mapRowToReminder(row[0]);
  }

  async updateReminder(
    id: string,
    userId: string,
    updates: UpdateReminderDTO
  ): Promise<Reminder | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.reminderTime !== undefined) {
      fields.push(`reminder_time = $${paramIndex++}`);
      values.push(updates.reminderTime);
    }
    if (updates.type !== undefined) {
      fields.push(`type = $${paramIndex++}`);
      values.push(updates.type);
    }

    if (fields.length === 0) {
      return this.getReminder(id, userId);
    }

    values.push(id, userId);
    const query = `UPDATE reminders SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`;

    const rows = await db.query<any>(query, values);
    return rows.length > 0 ? this.mapRowToReminder(rows[0]) : null;
  }

  async deleteReminder(id: string, userId: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM reminders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.length > 0;
  }

  private async getReminder(id: string, userId: string): Promise<Reminder | null> {
    const rows = await db.query<any>(
      'SELECT * FROM reminders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return rows.length > 0 ? this.mapRowToReminder(rows[0]) : null;
  }

  private mapRowToReminder(row: any): Reminder {
    return {
      id: row.id,
      taskId: row.task_id,
      userId: row.user_id,
      reminderTime: row.reminder_time,
      type: row.type,
      status: row.status,
      sentAt: row.sent_at,
      createdAt: row.created_at,
    };
  }
}

export const reminderService = new ReminderService();
