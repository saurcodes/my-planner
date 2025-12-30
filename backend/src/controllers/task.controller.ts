import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  CreateTaskDTO,
  UpdateTaskDTO,
  Task,
  EisenhowerMatrix,
  TaskStatus,
  VoiceTaskInput,
} from '@time-management/shared';
import { taskService } from '../services/task.service';
import { AppError } from '../middleware/error.middleware';

class TaskController {
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { status, quadrant, tags } = req.query;

      const tasks = await taskService.getTasks(userId, {
        status: status as TaskStatus,
        quadrant: quadrant as string,
        tags: tags ? (tags as string).split(',') : undefined,
      });

      const response: ApiResponse<Task[]> = {
        success: true,
        data: tasks,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const task = await taskService.getTask(id, userId);
      if (!task) {
        throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
      }

      const response: ApiResponse<Task> = {
        success: true,
        data: task,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async getMatrix(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const matrix = await taskService.getEisenhowerMatrix(userId);

      const response: ApiResponse<EisenhowerMatrix> = {
        success: true,
        data: matrix,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async createTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const taskData: CreateTaskDTO = req.body;

      const task = await taskService.createTask(userId, taskData);

      const response: ApiResponse<Task> = {
        success: true,
        data: task,
        message: 'Task created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  async createTaskFromVoice(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const voiceInput: VoiceTaskInput = req.body;

      const result = await taskService.createTaskFromVoice(userId, voiceInput);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Task created from voice input',
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updates: UpdateTaskDTO = req.body;

      const task = await taskService.updateTask(id, userId, updates);
      if (!task) {
        throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
      }

      const response: ApiResponse<Task> = {
        success: true,
        data: task,
        message: 'Task updated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const deleted = await taskService.deleteTask(id, userId);
      if (!deleted) {
        throw new AppError(404, 'TASK_NOT_FOUND', 'Task not found');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Task deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}

export const taskController = new TaskController();
