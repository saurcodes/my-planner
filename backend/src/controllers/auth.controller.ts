import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse, User } from '@time-management/shared';
import { authService } from '../services/auth.service';
import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

class AuthController {
  async oauthCallback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const oauthUser = req.user as any;
      const { user, token } = await authService.handleOAuthLogin(oauthUser);
      const redirectUrl = `${config.cors.origins[0]}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await authService.getUserById(userId);

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async mobileGoogleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, redirectUri } = req.body;

      if (!code || !redirectUri) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Authorization code and redirect URI are required',
          },
        };
        return res.status(400).json(response);
      }

      // Validate redirectUri against allowed origins
      const allowedRedirectUris = config.cors.origins;
      const isAllowed = allowedRedirectUris.some(origin => redirectUri.startsWith(origin));
      if (!isAllowed) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid redirect URI',
          },
        };
        return res.status(400).json(response);
      }

      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: config.oauth.google.clientId,
        client_secret: config.oauth.google.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const googleUser = userInfoResponse.data;

      const oauthUser = {
        provider: 'google',
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
      };

      const { user, token } = await authService.handleOAuthLogin(oauthUser);

      const response: ApiResponse<{ user: User; token: string }> = {
        success: true,
        data: { user, token },
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Mobile Google auth error:', error.response?.data || error);
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: error.response?.data?.error_description || 'Failed to authenticate with Google',
        },
      };
      res.status(500).json(response);
    }
  }
}

export const authController = new AuthController();
