export enum TaskQuadrant {
  URGENT_IMPORTANT = 'urgent_important',       // Do First
  NOT_URGENT_IMPORTANT = 'not_urgent_important', // Schedule
  URGENT_NOT_IMPORTANT = 'urgent_not_important', // Delegate (or do quick)
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important' // Eliminate
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  urgency: number; // 1-10 scale
  importance: number; // 1-10 scale
  quadrant: TaskQuadrant;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedMinutes?: number;
  deadline?: Date;
  scheduledFor?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  urgency?: number;
  importance?: number;
  estimatedMinutes?: number;
  deadline?: Date;
  scheduledFor?: Date;
  tags?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  urgency?: number;
  importance?: number;
  estimatedMinutes?: number;
  deadline?: Date;
  scheduledFor?: Date;
  status?: TaskStatus;
  tags?: string[];
}

export interface EisenhowerMatrix {
  urgentImportant: Task[];
  notUrgentImportant: Task[];
  urgentNotImportant: Task[];
  notUrgentNotImportant: Task[];
}
