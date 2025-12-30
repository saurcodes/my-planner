import jwt from 'jsonwebtoken';
import { db } from '../database/connection';
import { User, CreateUserDTO } from '@time-management/shared';
import { config } from '../config';
import { logger } from '../utils/logger';

class AuthService {
  async handleOAuthLogin(oauthUser: any): Promise<{ user: User; token: string }> {
    try {
      // Check if user exists
      let user = await this.getUserByOAuth(oauthUser.provider, oauthUser.id);

      if (!user) {
        // Create new user
        const createData: CreateUserDTO = {
          email: oauthUser.email,
          name: oauthUser.displayName || oauthUser.name,
          oauthProvider: oauthUser.provider,
          oauthId: oauthUser.id,
        };
        user = await this.createUser(createData);
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      return { user, token };
    } catch (error) {
      logger.error('OAuth login error', error);
      throw error;
    }
  }

  async getUserByOAuth(provider: string, oauthId: string): Promise<User | null> {
    const rows = await db.query<any>(
      'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
      [provider, oauthId]
    );
    return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
  }

  async getUserById(id: string): Promise<User> {
    const rows = await db.query<any>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (rows.length === 0) {
      throw new Error('User not found');
    }
    return this.mapRowToUser(rows[0]);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    const row = await db.query<any>(
      `INSERT INTO users (email, name, oauth_provider, oauth_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.email, data.name, data.oauthProvider, data.oauthId]
    );
    return this.mapRowToUser(row[0]);
  }

  generateToken(userId: string): string {
    // @ts-ignore - jwt.sign types issue with expiresIn
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      oauthProvider: row.oauth_provider,
      oauthId: row.oauth_id,
      settings: row.settings,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const authService = new AuthService();
