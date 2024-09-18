import { Request, Response } from 'express';
import { IActivityLog } from '../../domain/entities/ActivityLog';
import ActivityLogRepository from '../../infrastructure/databases/MongoActivityLogRepo';
import Logger from '../../infrastructure/logging/Logger'; // Your Winston logger

class ActivityLogController {
  private activityLogRepository = new ActivityLogRepository();

  // Create a new activity log
  async createActivityLog(req: Request, res: Response): Promise<void> {
    try {
      const activityLogData: IActivityLog = req.body;
      const activityLog = await this.activityLogRepository.create(activityLogData);
      res.status(201).json({
        message: 'Activity log created successfully',
        activityLog,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create activity log: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to create activity log',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get activity logs by user ID
  async getActivityLogsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const activityLogs = await this.activityLogRepository.findByUserId(userId);
      if (activityLogs.length > 0) {
        res.status(200).json(activityLogs);
      } else {
        res.status(404).json({
          message: 'No activity logs found for this user',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to retrieve activity logs by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to retrieve activity logs',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get an activity log by ID
  async getActivityLogById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const activityLog = await this.activityLogRepository.findById(id);
      if (activityLog) {
        res.status(200).json(activityLog);
      } else {
        res.status(404).json({
          message: 'Activity log not found',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to retrieve activity log by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to retrieve activity log',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Delete an activity log by ID
  async deleteActivityLog(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const deletedActivityLog = await this.activityLogRepository.delete(id);
      if (deletedActivityLog) {
        res.status(200).json({
          message: 'Activity log deleted successfully',
          activityLog: deletedActivityLog,
        });
      } else {
        res.status(404).json({
          message: 'Activity log not found',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete activity log: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to delete activity log',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default ActivityLogController;
