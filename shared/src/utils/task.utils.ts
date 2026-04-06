import { Task, TaskQuadrant, TaskPriority } from '../types/task.types';
import { getDaysUntil } from './date.utils';

/**
 * Calculate task quadrant based on urgency and importance scores
 * Urgency/Importance scale: 1-10
 * - >= 6 is considered high
 * - < 6 is considered low
 */
export const calculateQuadrant = (urgency: number, importance: number): TaskQuadrant => {
  const isUrgent = urgency >= 6;
  const isImportant = importance >= 6;

  if (isUrgent && isImportant) {
    return TaskQuadrant.URGENT_IMPORTANT;
  } else if (!isUrgent && isImportant) {
    return TaskQuadrant.NOT_URGENT_IMPORTANT;
  } else if (isUrgent && !isImportant) {
    return TaskQuadrant.URGENT_NOT_IMPORTANT;
  } else {
    return TaskQuadrant.NOT_URGENT_NOT_IMPORTANT;
  }
};

/**
 * Calculate task priority based on quadrant and deadline
 */
export const calculatePriority = (task: Pick<Task, 'quadrant' | 'deadline'>): TaskPriority => {
  if (task.quadrant === TaskQuadrant.URGENT_IMPORTANT) {
    return TaskPriority.URGENT;
  }

  if (task.deadline) {
    const daysUntil = getDaysUntil(task.deadline);
    if (daysUntil <= 1) {
      return TaskPriority.URGENT;
    } else if (daysUntil <= 3) {
      return TaskPriority.HIGH;
    }
  }

  if (task.quadrant === TaskQuadrant.NOT_URGENT_IMPORTANT) {
    return TaskPriority.HIGH;
  }

  if (task.quadrant === TaskQuadrant.URGENT_NOT_IMPORTANT) {
    return TaskPriority.MEDIUM;
  }

  return TaskPriority.LOW;
};

/**
 * Auto-calculate urgency based on deadline proximity
 */
export const calculateUrgencyFromDeadline = (deadline?: Date | string): number => {
  if (!deadline) {
    return 3; // Default low urgency if no deadline
  }

  const daysUntil = getDaysUntil(deadline);

  if (daysUntil <= 0) {
    return 10; // Overdue
  } else if (daysUntil <= 1) {
    return 9;
  } else if (daysUntil <= 2) {
    return 8;
  } else if (daysUntil <= 3) {
    return 7;
  } else if (daysUntil <= 7) {
    return 6;
  } else if (daysUntil <= 14) {
    return 5;
  } else if (daysUntil <= 30) {
    return 4;
  } else {
    return 3;
  }
};

/**
 * Sort tasks by priority and deadline
 */
export const sortTasks = (tasks: Task[]): Task[] => {
  const priorityOrder = {
    [TaskPriority.URGENT]: 0,
    [TaskPriority.HIGH]: 1,
    [TaskPriority.MEDIUM]: 2,
    [TaskPriority.LOW]: 3,
  };

  return [...tasks].sort((a, b) => {
    // First sort by priority
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    // Then by deadline (earlier first)
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline) {
      return -1;
    } else if (b.deadline) {
      return 1;
    }

    // Finally by creation date (newer first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
