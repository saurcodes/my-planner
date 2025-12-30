import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './config/passport';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

// Import routes (will be created next)
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import planningRoutes from './routes/planning.routes';
import focusRoutes from './routes/focus.routes';
import analyticsRoutes from './routes/analytics.routes';
import reminderRoutes from './routes/reminder.routes';
import tagRoutes from './routes/tag.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport initialization
app.use(passport.initialize());

// Logging
const morganFormat = config.env === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/planning', planningRoutes);
app.use('/focus', focusRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/reminders', reminderRoutes);
app.use('/tags', tagRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
