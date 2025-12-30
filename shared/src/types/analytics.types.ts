export interface DailyAnalytics {
  id: string;
  userId: string;
  date: Date;
  tasksCompleted: number;
  tasksCreated: number;
  focusTimeMinutes: number;
  quadrantDistribution: {
    urgentImportant: number;
    notUrgentImportant: number;
    urgentNotImportant: number;
    notUrgentNotImportant: number;
  };
  productivityScore: number; // 0-100
  createdAt: Date;
}

export interface ProductivityTrend {
  date: string;
  tasksCompleted: number;
  focusTime: number;
  productivityScore: number;
}

export interface TimeTrackingData {
  totalFocusTime: number;
  averageSessionDuration: number;
  totalBreakTime: number;
  sessionsCompleted: number;
  tasksByQuadrant: {
    quadrant: string;
    count: number;
    timeSpent: number;
  }[];
}

export interface AIInsight {
  id: string;
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  recommendation: string;
  createdAt: Date;
}

export enum InsightType {
  PRODUCTIVITY_PATTERN = 'productivity_pattern',
  TIME_MANAGEMENT = 'time_management',
  FOCUS_IMPROVEMENT = 'focus_improvement',
  TASK_PRIORITIZATION = 'task_prioritization',
  WORK_LIFE_BALANCE = 'work_life_balance'
}

export interface AnalyticsQuery {
  startDate: Date;
  endDate: Date;
  groupBy?: 'day' | 'week' | 'month';
}
