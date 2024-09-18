import { IActivityLog } from '../entities/ActivityLog';

// Define the interface for the activity log repository
export interface IActivityLogRepository {
  create(activityLog: IActivityLog): Promise<IActivityLog>;
  findByUserId(userId: string): Promise<IActivityLog[]>;
  findById(id: string): Promise<IActivityLog | null>;
  delete(id: string): Promise<IActivityLog | null>;
}
