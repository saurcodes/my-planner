import { db } from '../database/connection';
import {
  ProductivityTrend,
  TimeTrackingData,
  AIInsight,
  AnalyticsQuery,
  DailyAnalytics,
} from '@time-management/shared';
import { claudeService } from './claude.service';
import { taskService } from './task.service';

class AnalyticsService {
  async getProductivityTrends(
    userId: string,
    query: AnalyticsQuery
  ): Promise<ProductivityTrend[]> {
    const rows = await db.query<any>(
      `SELECT date, tasks_completed, focus_time_minutes, productivity_score
       FROM daily_analytics
       WHERE user_id = $1 AND date >= $2 AND date <= $3
       ORDER BY date ASC`,
      [userId, query.startDate, query.endDate]
    );

    return rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      tasksCompleted: row.tasks_completed,
      focusTime: row.focus_time_minutes,
      productivityScore: row.productivity_score || 0,
    }));
  }

  async getTimeTracking(userId: string, query: AnalyticsQuery): Promise<TimeTrackingData> {
    const sessions = await db.query<any>(
      `SELECT * FROM focus_sessions
       WHERE user_id = $1 AND start_time >= $2 AND start_time <= $3 AND status = 'completed'`,
      [userId, query.startDate, query.endDate]
    );

    const totalFocusTime = sessions.reduce((sum, s) => {
      const duration = (new Date(s.end_time).getTime() - new Date(s.start_time).getTime()) / 60000;
      return sum + duration;
    }, 0);

    const averageSessionDuration = sessions.length > 0 ? totalFocusTime / sessions.length : 0;

    // Get tasks by quadrant
    const tasks = await taskService.getTasks(userId);
    const quadrantStats: any = {};

    tasks.forEach(task => {
      if (!quadrantStats[task.quadrant]) {
        quadrantStats[task.quadrant] = { count: 0, timeSpent: 0 };
      }
      quadrantStats[task.quadrant].count++;
    });

    const tasksByQuadrant = Object.entries(quadrantStats).map(([quadrant, stats]: any) => ({
      quadrant,
      count: stats.count,
      timeSpent: stats.timeSpent,
    }));

    return {
      totalFocusTime: Math.round(totalFocusTime),
      averageSessionDuration: Math.round(averageSessionDuration),
      totalBreakTime: 0, // Calculate from breaks data
      sessionsCompleted: sessions.length,
      tasksByQuadrant,
    };
  }

  async getAIInsights(userId: string): Promise<AIInsight[]> {
    const rows = await db.query<any>(
      `SELECT * FROM ai_insights
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    return rows.map(this.mapRowToInsight);
  }

  async generateAIInsights(userId: string): Promise<AIInsight[]> {
    // Get user's data
    const tasks = await taskService.getTasks(userId);
    const analyticsData = await this.getProductivityTrends(userId, {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      endDate: new Date(),
    });

    // Use Claude to generate insights
    const insights = await claudeService.generateInsights(userId, tasks, analyticsData);

    // Save insights to database
    const savedInsights: AIInsight[] = [];
    for (const insight of insights) {
      const row = await db.query<any>(
        `INSERT INTO ai_insights (user_id, type, title, description, recommendation)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, insight.type, insight.title, insight.description, insight.recommendation]
      );
      savedInsights.push(this.mapRowToInsight(row[0]));
    }

    return savedInsights;
  }

  private mapRowToInsight(row: any): AIInsight {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      title: row.title,
      description: row.description,
      recommendation: row.recommendation,
      createdAt: row.created_at,
    };
  }
}

export const analyticsService = new AnalyticsService();
