import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  Reminder,
  CreateReminderDTO,
  UpdateReminderDTO,
} from '@time-management/shared';
import { reminderService } from '../services/reminder.service';
import { AppError } from '../middleware/error.middleware';

class ReminderController {
  async getReminders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const reminders = await reminderService.getReminders(userId);

      const response: ApiResponse<Reminder[]> = {
        success: true,
        data: reminders,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingReminders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const reminders = await reminderService.getUpcomingReminders(userId);

      const response: ApiResponse<Reminder[]> = {
        success: true,
        data: reminders,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createReminder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const reminderData: CreateReminderDTO = req.body;

      const reminder = await reminderService.createReminder(userId, reminderData);

      const response: ApiResponse<Reminder> = {
        success: true,
        data: reminder,
        message: 'Reminder created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateReminder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updates: UpdateReminderDTO = req.body;

      const reminder = await reminderService.updateReminder(id, userId, updates);
      if (!reminder) {
        throw new AppError(404, 'REMINDER_NOT_FOUND', 'Reminder not found');
      }

      const response: ApiResponse<Reminder> = {
        success: true,
        data: reminder,
        message: 'Reminder updated successfully',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteReminder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const deleted = await reminderService.deleteReminder(id, userId);
      if (!deleted) {
        throw new AppError(404, 'REMINDER_NOT_FOUND', 'Reminder not found');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Reminder deleted successfully',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const reminderController = new ReminderController();
