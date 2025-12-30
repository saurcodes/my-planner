import {
  DailyPlanQuestion,
  DailyPlanRequest,
  DailyPlanResponse,
} from '@time-management/shared';
import { claudeService } from './claude.service';
import { taskService } from './task.service';

class PlanningService {
  getDailyPlanningQuestions(): DailyPlanQuestion[] {
    return [
      {
        id: 'energy_level',
        question: 'How would you rate your energy level today?',
        type: 'multiple_choice',
        options: ['Low', 'Medium', 'High', 'Very High'],
        required: true,
      },
      {
        id: 'priorities',
        question: 'What are your top 3 priorities for today?',
        type: 'text',
        required: true,
      },
      {
        id: 'deadlines',
        question: 'Do you have any urgent deadlines today?',
        type: 'text',
        required: false,
      },
      {
        id: 'meetings',
        question: 'How many meetings or commitments do you have?',
        type: 'number',
        required: false,
      },
      {
        id: 'focus_time',
        question: 'How many hours of deep focus work do you need?',
        type: 'number',
        required: false,
      },
      {
        id: 'work_start',
        question: 'What time do you want to start working?',
        type: 'time',
        required: true,
      },
      {
        id: 'work_end',
        question: 'What time do you want to finish working?',
        type: 'time',
        required: true,
      },
    ];
  }

  async generateDailyPlan(
    userId: string,
    planRequest: DailyPlanRequest
  ): Promise<DailyPlanResponse> {
    // Get existing tasks
    const existingTasks = await taskService.getTasks(userId);

    // Use Claude to generate the plan
    const plan = await claudeService.generateDailyPlan(userId, planRequest, existingTasks);

    return plan;
  }

  async getCurrentDailyPlan(userId: string): Promise<any> {
    // Get today's tasks
    const tasks = await taskService.getTasks(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter(t => {
      if (!t.scheduledFor) return false;
      const scheduled = new Date(t.scheduledFor);
      scheduled.setHours(0, 0, 0, 0);
      return scheduled.getTime() === today.getTime();
    });

    return {
      date: today,
      tasks: todayTasks,
    };
  }

  async updateDailyPlan(id: string, userId: string, updates: any): Promise<any> {
    // Implementation for updating daily plan
    return { id, userId, ...updates };
  }
}

export const planningService = new PlanningService();
