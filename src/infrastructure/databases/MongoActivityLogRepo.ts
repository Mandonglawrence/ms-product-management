import { IActivityLog } from '../../domain/entities/ActivityLog';
import ActivityLogModel from '../../domain/entities/ActivityLog'; // Adjust the import path based on your structure
import { IActivityLogRepository } from '../../domain/repositories/ActivityLogRepository'; // Interface for Activity Log repository
import logger from '../../infrastructure/logging/Logger'; // Adjust the import path based on your logger configuration

class ActivityLogRepository implements IActivityLogRepository {

  // Method to create a new activity log entry
  async create(activityLogData: IActivityLog): Promise<IActivityLog> {
    try {
      const activityLog = new ActivityLogModel(activityLogData);
      await activityLog.save();
      logger.info('Activity log created successfully', { activityLog: activityLog.toObject() });
      return activityLog.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to create activity log: ${error.message}`, { error });
        throw new Error(`Failed to create activity log: ${error.message}`);
      } else {
        logger.error('Failed to create activity log due to an unknown error');
        throw new Error('Failed to create activity log due to an unknown error');
      }
    }
  }

  // Method to find activity logs by user ID
  async findByUserId(userId: string): Promise<IActivityLog[]> {
    try {
      const activityLogs = await ActivityLogModel.find({ userId }).exec();
      const logs = activityLogs.map(log => log.toObject());
      logger.info('Found activity logs by user ID', { userId, logs });
      return logs;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to find activity logs by user ID: ${error.message}`, { userId, error });
        throw new Error(`Failed to find activity logs by user ID: ${error.message}`);
      } else {
        logger.error('Failed to find activity logs by user ID due to an unknown error', { userId });
        throw new Error('Failed to find activity logs by user ID due to an unknown error');
      }
    }
  }

  // Method to find an activity log by ID
  async findById(id: string): Promise<IActivityLog | null> {
    try {
      const activityLog = await ActivityLogModel.findById(id).exec();
      if (activityLog) {
        const log = activityLog.toObject();
        logger.info('Found activity log by ID', { id, log });
        return log;
      } else {
        logger.info('Activity log not found by ID', { id });
        return null;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to find activity log by ID: ${error.message}`, { id, error });
        throw new Error(`Failed to find activity log by ID: ${error.message}`);
      } else {
        logger.error('Failed to find activity log by ID due to an unknown error', { id });
        throw new Error('Failed to find activity log by ID due to an unknown error');
      }
    }
  }

  // Method to delete an activity log by ID
  async delete(id: string): Promise<IActivityLog | null> {
    try {
      const result = await ActivityLogModel.findByIdAndDelete(id).exec();
      if (result) {
        const log = result.toObject();
        logger.info('Activity log deleted successfully', { id, log });
        return log;
      } else {
        logger.info('Activity log not found for deletion', { id });
        return null;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Failed to delete activity log: ${error.message}`, { id, error });
        throw new Error(`Failed to delete activity log: ${error.message}`);
      } else {
        logger.error('Failed to delete activity log due to an unknown error', { id });
        throw new Error('Failed to delete activity log due to an unknown error');
      }
    }
  }
}

export default ActivityLogRepository;
