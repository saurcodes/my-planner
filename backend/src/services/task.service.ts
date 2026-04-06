import { db } from '../database/connection';
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskStatus,
  EisenhowerMatrix,
  TaskQuadrant,
  VoiceTaskInput,
  TaskPriority,
} from '@time-management/shared';
import {
  calculateQuadrant,
  calculatePriority,
  calculateUrgencyFromDeadline,
} from '@time-management/shared';
import { claudeService } from './claude.service';

interface TaskFilter {
  status?: TaskStatus;
  quadrant?: string;
  tags?: string[];
}

class TaskService {
  async getTasks(userId: string, filter?: TaskFilter): Promise<Task[]> {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (filter?.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filter.status);
      paramIndex++;
    }

    if (filter?.quadrant) {
      query += ` AND quadrant = $${paramIndex}`;
      params.push(filter.quadrant);
      paramIndex++;
    }

    if (filter?.tags && filter.tags.length > 0) {
      query += ` AND tags ?| $${paramIndex}`;
      params.push(filter.tags);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const rows = await db.query<any>(query, params);
    return rows.map(this.mapRowToTask);
  }

  async getTask(id: string, userId: string): Promise<Task | null> {
    const rows = await db.query<any>(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return rows.length > 0 ? this.mapRowToTask(rows[0]) : null;
  }

  async getEisenhowerMatrix(userId: string): Promise<EisenhowerMatrix> {
    const tasks = await this.getTasks(userId, { status: TaskStatus.TODO });

    return {
      urgentImportant: tasks.filter(t => t.quadrant === TaskQuadrant.URGENT_IMPORTANT),
      notUrgentImportant: tasks.filter(t => t.quadrant === TaskQuadrant.NOT_URGENT_IMPORTANT),
      urgentNotImportant: tasks.filter(t => t.quadrant === TaskQuadrant.URGENT_NOT_IMPORTANT),
      notUrgentNotImportant: tasks.filter(t => t.quadrant === TaskQuadrant.NOT_URGENT_NOT_IMPORTANT),
    };
  }

  async createTask(userId: string, data: CreateTaskDTO): Promise<Task> {
    // Auto-calculate urgency from deadline if not provided
    const urgency = data.urgency || calculateUrgencyFromDeadline(data.deadline);
    const importance = data.importance || 5;
    const quadrant = calculateQuadrant(urgency, importance);

    const row = await db.query<any>(
      `INSERT INTO tasks (
        user_id, title, description, urgency, importance, quadrant, priority,
        estimated_minutes, deadline, scheduled_for, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        data.title,
        data.description || null,
        urgency,
        importance,
        quadrant,
        TaskPriority.MEDIUM, // Will be updated after mapping
        data.estimatedMinutes || null,
        data.deadline || null,
        data.scheduledFor || null,
        JSON.stringify(data.tags || []),
      ]
    );

    const task = this.mapRowToTask(row[0]);

    // Update priority based on task data
    const priority = calculatePriority(task);
    await db.query('UPDATE tasks SET priority = $1 WHERE id = $2', [priority, task.id]);
    task.priority = priority;

    return task;
  }

  async createTaskFromVoice(userId: string, input: VoiceTaskInput): Promise<any> {
    // Use Claude to parse voice input
    const taskData = await claudeService.parseVoiceToTask(input);

    // Create the task
    const task = await this.createTask(userId, taskData);

    return {
      task,
      confidence: 0.9, // Placeholder
    };
  }

  async updateTask(id: string, userId: string, updates: UpdateTaskDTO): Promise<Task | null> {
    const existingTask = await this.getTask(id, userId);
    if (!existingTask) {
      return null;
    }

    // Recalculate quadrant if urgency or importance changed
    const urgency = updates.urgency !== undefined ? updates.urgency : existingTask.urgency;
    const importance = updates.importance !== undefined ? updates.importance : existingTask.importance;
    const quadrant = calculateQuadrant(urgency, importance);

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.urgency !== undefined) {
      fields.push(`urgency = $${paramIndex++}`);
      values.push(updates.urgency);
    }
    if (updates.importance !== undefined) {
      fields.push(`importance = $${paramIndex++}`);
      values.push(updates.importance);
    }
    fields.push(`quadrant = $${paramIndex++}`);
    values.push(quadrant);
    if (updates.estimatedMinutes !== undefined) {
      fields.push(`estimated_minutes = $${paramIndex++}`);
      values.push(updates.estimatedMinutes);
    }
    if (updates.deadline !== undefined) {
      fields.push(`deadline = $${paramIndex++}`);
      values.push(updates.deadline);
    }
    if (updates.scheduledFor !== undefined) {
      fields.push(`scheduled_for = $${paramIndex++}`);
      values.push(updates.scheduledFor);
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
      if (updates.status === TaskStatus.COMPLETED) {
        fields.push(`completed_at = CURRENT_TIMESTAMP`);
      }
    }
    if (updates.tags !== undefined) {
      fields.push(`tags = $${paramIndex++}`);
      values.push(JSON.stringify(updates.tags));
    }

    if (fields.length === 0) {
      return existingTask;
    }

    values.push(id, userId);
    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`;

    const rows = await db.query<any>(query, values);
    return rows.length > 0 ? this.mapRowToTask(rows[0]) : null;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.length > 0;
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      urgency: row.urgency,
      importance: row.importance,
      quadrant: row.quadrant,
      priority: row.priority,
      status: row.status,
      estimatedMinutes: row.estimated_minutes,
      deadline: row.deadline,
      scheduledFor: row.scheduled_for,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at,
    };
  }
}

export const taskService = new TaskService();
