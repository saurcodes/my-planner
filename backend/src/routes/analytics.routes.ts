import { Router } from 'express';
import { query } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { analyticsController } from '../controllers/analytics.controller';

const router = Router();

// All analytics routes require authentication
router.use(authenticateToken);

// Get productivity trends
router.get(
  '/trends',
  [
    query('startDate').isISO8601(),
    query('endDate').isISO8601(),
    query('groupBy').optional().isIn(['day', 'week', 'month']),
    validate,
  ],
  analyticsController.getProductivityTrends
);

// Get time tracking data
router.get(
  '/time-tracking',
  [
    query('startDate').isISO8601(),
    query('endDate').isISO8601(),
    validate,
  ],
  analyticsController.getTimeTracking
);

// Get AI-generated insights
router.get('/insights', analyticsController.getAIInsights);

// Generate new AI insights
router.post('/insights/generate', analyticsController.generateInsights);

export default router;
