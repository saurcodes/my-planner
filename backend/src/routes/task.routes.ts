import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { taskController } from '../controllers/task.controller';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Get all tasks
router.get(
  '/',
  [
    query('status').optional().isIn(['todo', 'in_progress', 'completed', 'cancelled']),
    query('quadrant').optional().isIn(['urgent_important', 'not_urgent_important', 'urgent_not_important', 'not_urgent_not_important']),
    query('tags').optional().isString(),
    validate,
  ],
  taskController.getTasks
);

// Get Eisenhower matrix view
router.get('/matrix', taskController.getMatrix);

// Get single task
router.get('/:id', [param('id').isUUID(), validate], taskController.getTask);

// Create task
router.post(
  '/',
  [
    body('title').isString().trim().notEmpty().isLength({ max: 500 }),
    body('description').optional().isString(),
    body('urgency').optional().isInt({ min: 1, max: 10 }),
    body('importance').optional().isInt({ min: 1, max: 10 }),
    body('estimatedMinutes').optional().isInt({ min: 1 }),
    body('deadline').optional().isISO8601(),
    body('scheduledFor').optional().isISO8601(),
    body('tags').optional().isArray(),
    validate,
  ],
  taskController.createTask
);

// Create task from voice input
router.post('/voice', taskController.createTaskFromVoice);

// Update task
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('title').optional().isString().trim().notEmpty().isLength({ max: 500 }),
    body('description').optional().isString(),
    body('urgency').optional().isInt({ min: 1, max: 10 }),
    body('importance').optional().isInt({ min: 1, max: 10 }),
    body('estimatedMinutes').optional().isInt({ min: 1 }),
    body('deadline').optional().isISO8601(),
    body('scheduledFor').optional().isISO8601(),
    body('status').optional().isIn(['todo', 'in_progress', 'completed', 'cancelled']),
    body('tags').optional().isArray(),
    validate,
  ],
  taskController.updateTask
);

// Delete task
router.delete('/:id', [param('id').isUUID(), validate], taskController.deleteTask);

export default router;
