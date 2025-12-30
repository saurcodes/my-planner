import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import {
  ApiResponse,
  Tag,
  CreateTagDTO,
  UpdateTagDTO,
} from '@time-management/shared';
import { tagService } from '../services/tag.service';
import { AppError } from '../middleware/error.middleware';

class TagController {
  async getTags(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const tags = await tagService.getTags(userId);

      const response: ApiResponse<Tag[]> = {
        success: true,
        data: tags,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async createTag(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const tagData: CreateTagDTO = req.body;

      const tag = await tagService.createTag(userId, tagData);

      const response: ApiResponse<Tag> = {
        success: true,
        data: tag,
        message: 'Tag created successfully',
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  async updateTag(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const updates: UpdateTagDTO = req.body;

      const tag = await tagService.updateTag(id, userId, updates);
      if (!tag) {
        throw new AppError(404, 'TAG_NOT_FOUND', 'Tag not found');
      }

      const response: ApiResponse<Tag> = {
        success: true,
        data: tag,
        message: 'Tag updated successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async deleteTag(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const deleted = await tagService.deleteTag(id, userId);
      if (!deleted) {
        throw new AppError(404, 'TAG_NOT_FOUND', 'Tag not found');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Tag deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}

export const tagController = new TagController();
