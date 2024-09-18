import { Document, Schema, model, Types } from 'mongoose';

export interface IActivityLog {
  userId: Types.ObjectId;  // Use Types.ObjectId instead of string
  method: string;
  route: string;
  statusCode: number;
  responseTime: string;
  timestamp: Date;
  ip: string;
}

const activityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: Schema.Types.ObjectId,  // Correct type assignment
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  method: {
    type: String,
    required: [true, 'HTTP method is required'],
  },
  route: {
    type: String,
    required: [true, 'Route is required'],
  },
  statusCode: {
    type: Number,
    required: [true, 'Status code is required'],
  },
  responseTime: {
    type: String,
    required: [true, 'Response time is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: [true, 'IP address is required'],
  },
});

// Create the Mongoose model for the ActivityLog entity
const ActivityLogModel = model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLogModel;
