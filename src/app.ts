import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import productRoutes from './presentation/routes/ProductRoutes';
import userRoutes from './presentation/routes/UserRoutes';
import authRoutes from './presentation/routes/AuthRoutes';
import userRoleRoutes from './presentation/routes/UserRoleRoutes';
import activityLogRoutes from './presentation/routes/ActivityLogRoutes';
import { errorHandler } from './presentation/middlewares/errorHandler'; 
import logger from './infrastructure/logging/Logger';
import {authMiddleware} from './presentation/middlewares/authMiddleware';
import { activityLogRepository } from './infrastructure/dataSources';
import activityLoggerMiddleware from './presentation/middlewares/activityLoggerMiddileware';

// Create the express application
const app = express();

// Define morgan stream to use with Winston
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};

// Conditionally apply morgan logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined', { stream: morganStream }));
}

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Security headers
app.use(cors()); // CORS

// Routes
app.use(activityLoggerMiddleware(activityLogRepository));
app.use('/api/products', authMiddleware,productRoutes);
app.use('/api/users',authMiddleware, userRoutes);
app.use('/api/user-roles',authMiddleware, userRoleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/activity-logs',authMiddleware, activityLogRoutes);

// Global error handler
app.use(errorHandler);

export default app;
