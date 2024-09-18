import { Request, Response, NextFunction } from 'express';
import { IActivityLogRepository } from '../../domain/repositories/ActivityLogRepository'; // Adjust the path if needed
import Logger from '../../infrastructure/logging/Logger'; // Your Winston logger
import { IActivityLog } from '../../domain/entities/ActivityLog'; // Adjust the path to the ActivityLog entity

// The middleware function to log user activities
const activityLoggerMiddleware = (activityLogRepository: IActivityLogRepository) => {
    console.log("gottttttt");
    
  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Listen for the response 'finish' event to log the activity after the request is completed
    res.on('finish', async () => {
      try {
        const duration = Date.now() - startTime;

        // Extract user ID from JWT or any other authentication method
        const userId = req.user?.id || 'anonymous'; // Assuming you're attaching the user ID in `req.user` during authentication

        // Create an activity log object (using Partial to avoid needing all properties upfront)
        const activityLog: Partial<IActivityLog> = {
          userId, // Log as 'anonymous' if user ID is not available
          method: req.method,
          route: req.originalUrl,
          statusCode: res.statusCode,
          responseTime: `${duration}ms`,
          timestamp: new Date(),
          ip: req.ip || '', // Ensure ip is always a string
        };

        // Save the log to the database
        await activityLogRepository.create(activityLog as IActivityLog);

        // Optionally log activity using Winston (debug level to avoid spamming logs)
        Logger.debug(`User activity logged for ${userId || 'anonymous'}: ${req.method} ${req.originalUrl}`);
      } catch (error) {
        Logger.error(`Failed to log user activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    next();
  };
};

export default activityLoggerMiddleware;
