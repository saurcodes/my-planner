import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { planningController } from '../controllers/planning.controller';

const router = Router();

// All planning routes require authentication
router.use(authenticateToken);

// Get daily planning questions
router.get('/questions', planningController.getQuestions);

// Generate daily plan from answers
router.post(
  '/daily',
  [
    body('answers').isArray().notEmpty(),
    body('answers.*.questionId').isString(),
    body('answers.*.answer').exists(),
    body('existingTasks').optional().isArray(),
    validate,
  ],
  planningController.generateDailyPlan
);

// Get current daily plan
router.get('/daily/current', planningController.getCurrentDailyPlan);

// Update daily plan
router.put('/daily/:id', planningController.updateDailyPlan);

export default router;
