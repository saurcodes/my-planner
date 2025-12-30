import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.oauthCallback);

// Apple OAuth (placeholder - requires additional setup)
router.get('/apple', passport.authenticate('apple'));
router.get('/apple/callback', passport.authenticate('apple', { session: false }), authController.oauthCallback);

// Logout
router.post('/logout', authController.logout);

// Get current user
router.get('/me', authController.getCurrentUser);

// Mobile OAuth - exchange authorization code for token
router.post('/mobile/google', authController.mobileGoogleAuth);

export default router;
