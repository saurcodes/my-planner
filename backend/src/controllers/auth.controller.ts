import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiResponse, User } from '@time-management/shared';
import { authService } from '../services/auth.service';
import axios from 'axios';

class AuthController {
  async oauthCallback(req: AuthRequest, res: Response) {
    try {
      // User info is attached by passport
      const oauthUser = req.user as any;

      const { user, token } = await authService.handleOAuthLogin(oauthUser);

      // Redirect to frontend with token
      const redirectUrl = `${process.env.WEB_URL}/auth/callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId!;
      const user = await authService.getUserById(userId);

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async logout(req: Request, res: Response) {
    try {
      // For JWT, logout is handled client-side by removing the token
      // Here we could add token to blacklist if needed

      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  async mobileGoogleAuth(req: Request, res: Response) {
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

      // Exchange authorization code for tokens from Google
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      const { access_token } = tokenResponse.data;

      // Get user info from Google
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const googleUser = userInfoResponse.data;

      // Transform Google user data to match our OAuth user format
      const oauthUser = {
        provider: 'google',
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
      };

      // Create/login user and generate JWT token
      const { user, token } = await authService.handleOAuthLogin(oauthUser);

      const response: ApiResponse<{ user: User; token: string }> = {
        success: true,
        data: { user, token },
      };

      res.json(response);
    } catch (error: any) {
      console.error('Mobile Google auth error:', error.response?.data || error);
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
