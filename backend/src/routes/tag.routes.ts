import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { tagController } from '../controllers/tag.controller';

const router = Router();

// All tag routes require authentication
router.use(authenticateToken);

// Get all tags
router.get('/', tagController.getTags);

// Create tag
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty().isLength({ max: 100 }),
    body('color').isString().matches(/^#[0-9A-F]{6}$/i),
    validate,
  ],
  tagController.createTag
);

// Update tag
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().isString().trim().notEmpty().isLength({ max: 100 }),
    body('color').optional().isString().matches(/^#[0-9A-F]{6}$/i),
    validate,
  ],
  tagController.updateTag
);

// Delete tag
router.delete('/:id', [param('id').isUUID(), validate], tagController.deleteTag);

export default router;
