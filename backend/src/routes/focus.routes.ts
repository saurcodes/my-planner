import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { focusController } from '../controllers/focus.controller';

const router = Router();

// All focus routes require authentication
router.use(authenticateToken);

// Get user's focus sessions
router.get('/', focusController.getFocusSessions);

// Get active focus session
router.get('/active', focusController.getActiveSession);

// Start focus session
router.post(
  '/start',
  [body('taskId').optional().isUUID(), validate],
  focusController.startSession
);

// End focus session
router.put(
  '/:id/end',
  [
    param('id').isUUID(),
    body('productivityScore').optional().isInt({ min: 0, max: 100 }),
    body('notes').optional().isString(),
    validate,
  ],
  focusController.endSession
);

// Pause focus session
router.put('/:id/pause', [param('id').isUUID(), validate], focusController.pauseSession);

// Resume focus session
router.put('/:id/resume', [param('id').isUUID(), validate], focusController.resumeSession);

// Get blocked sites configuration
router.get('/blocked-sites', focusController.getBlockedSites);

// Update blocked sites
router.put(
  '/blocked-sites',
  [body('websites').isArray(), validate],
  focusController.updateBlockedSites
);

export default router;
