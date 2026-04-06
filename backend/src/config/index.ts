import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3001',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'time_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('DB_PASSWORD environment variable is required in production'); })() : 'postgres'),
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  jwt: {
    secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('JWT_SECRET environment variable is required in production'); })() : 'dev-only-secret-key'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      teamId: process.env.APPLE_TEAM_ID || '',
      keyId: process.env.APPLE_KEY_ID || '',
      privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH || '',
      callbackUrl: process.env.APPLE_CALLBACK_URL || '',
    },
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    fastModel: process.env.ANTHROPIC_FAST_MODEL || 'claude-haiku-4-5-20251001',
  },

  fcm: {
    serverKey: process.env.FCM_SERVER_KEY || '',
  },

  cors: {
    origins: [
      process.env.WEB_URL || 'http://localhost:3000',
      process.env.MOBILE_URL || 'capacitor://localhost',
      'http://localhost:8081', // Expo web server
    ],
  },

  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};
