import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  DailyPlanQuestion,
  DailyPlanRequest,
  DailyPlanResponse,
} from '@time-management/shared';
import { planningService } from '../services/planning.service';

class PlanningController {
  async getQuestions(req: AuthRequest, res: Response) {
    try {
      const questions = planningService.getDailyPlanningQuestions();

      const response: ApiResponse<DailyPlanQuestion[]> = {
        success: true,
        data: questions,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async generateDailyPlan(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const planRequest: DailyPlanRequest = req.body;

      const plan = await planningService.generateDailyPlan(userId, planRequest);

      const response: ApiResponse<DailyPlanResponse> = {
        success: true,
        data: plan,
        message: 'Daily plan generated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentDailyPlan(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const plan = await planningService.getCurrentDailyPlan(userId);

      const response: ApiResponse = {
        success: true,
        data: plan,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async updateDailyPlan(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updates = req.body;

      const plan = await planningService.updateDailyPlan(id, userId, updates);

      const response: ApiResponse = {
        success: true,
        data: plan,
        message: 'Daily plan updated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}

export const planningController = new PlanningController();
