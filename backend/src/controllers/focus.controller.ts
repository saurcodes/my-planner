import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  FocusSession,
  StartFocusSessionResponse,
} from '@time-management/shared';
import { focusService } from '../services/focus.service';
import { AppError } from '../middleware/error.middleware';

class FocusController {
  async getFocusSessions(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const sessions = await focusService.getFocusSessions(userId);

      const response: ApiResponse<FocusSession[]> = {
        success: true,
        data: sessions,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getActiveSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const session = await focusService.getActiveSession(userId);

      const response: ApiResponse<FocusSession | null> = {
        success: true,
        data: session,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async startSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { taskId } = req.body;

      const result = await focusService.startSession(userId, taskId);

      const response: ApiResponse<StartFocusSessionResponse> = {
        success: true,
        data: result,
        message: 'Focus session started',
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  async endSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { productivityScore, notes } = req.body;

      const session = await focusService.endSession(id, userId, { productivityScore, notes });
      if (!session) {
        throw new AppError(404, 'SESSION_NOT_FOUND', 'Focus session not found');
      }

      const response: ApiResponse<FocusSession> = {
        success: true,
        data: session,
        message: 'Focus session ended',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async pauseSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const session = await focusService.pauseSession(id, userId);
      if (!session) {
        throw new AppError(404, 'SESSION_NOT_FOUND', 'Focus session not found');
      }

      const response: ApiResponse<FocusSession> = {
        success: true,
        data: session,
        message: 'Focus session paused',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async resumeSession(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const session = await focusService.resumeSession(id, userId);
      if (!session) {
        throw new AppError(404, 'SESSION_NOT_FOUND', 'Focus session not found');
      }

      const response: ApiResponse<FocusSession> = {
        success: true,
        data: session,
        message: 'Focus session resumed',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getBlockedSites(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const sites = await focusService.getBlockedSites(userId);

      const response: ApiResponse<string[]> = {
        success: true,
        data: sites,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async updateBlockedSites(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { websites } = req.body;

      await focusService.updateBlockedSites(userId, websites);

      const response: ApiResponse = {
        success: true,
        message: 'Blocked sites updated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}

export const focusController = new FocusController();
