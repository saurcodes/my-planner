import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { reminderController } from '../controllers/reminder.controller';

const router = Router();

// All reminder routes require authentication
router.use(authenticateToken);

// Get all reminders
router.get('/', reminderController.getReminders);

// Get upcoming reminders
router.get('/upcoming', reminderController.getUpcomingReminders);

// Create reminder
router.post(
  '/',
  [
    body('taskId').isUUID(),
    body('reminderTime').isISO8601(),
    body('type').isIn(['push', 'in_app']),
    validate,
  ],
  reminderController.createReminder
);

// Update reminder
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('reminderTime').optional().isISO8601(),
    body('type').optional().isIn(['push', 'in_app']),
    validate,
  ],
  reminderController.updateReminder
);

// Delete reminder
router.delete('/:id', [param('id').isUUID(), validate], reminderController.deleteReminder);

export default router;
