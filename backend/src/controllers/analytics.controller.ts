import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  ProductivityTrend,
  TimeTrackingData,
  AIInsight,
  AnalyticsQuery,
} from '@time-management/shared';
import { analyticsService } from '../services/analytics.service';

class AnalyticsController {
  async getProductivityTrends(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { startDate, endDate, groupBy } = req.query;

      const query: AnalyticsQuery = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        groupBy: groupBy as 'day' | 'week' | 'month' | undefined,
      };

      const trends = await analyticsService.getProductivityTrends(userId, query);

      const response: ApiResponse<ProductivityTrend[]> = {
        success: true,
        data: trends,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getTimeTracking(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { startDate, endDate } = req.query;

      const query: AnalyticsQuery = {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      };

      const timeTracking = await analyticsService.getTimeTracking(userId, query);

      const response: ApiResponse<TimeTrackingData> = {
        success: true,
        data: timeTracking,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getAIInsights(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const insights = await analyticsService.getAIInsights(userId);

      const response: ApiResponse<AIInsight[]> = {
        success: true,
        data: insights,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async generateInsights(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const insights = await analyticsService.generateAIInsights(userId);

      const response: ApiResponse<AIInsight[]> = {
        success: true,
        data: insights,
        message: 'AI insights generated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}

export const analyticsController = new AnalyticsController();
