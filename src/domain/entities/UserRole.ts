import mongoose, { Schema, Document } from 'mongoose';
import { permissions, roles } from '../../shared/constants';

export interface IUserRole {
    id?: string;
    name: string;
    role: string;
    description?: string;
    permissions: string[]; 
    createdAt?: Date;
    updatedAt?: Date;
  }


const UserRoleSchema: Schema = new Schema<IUserRole>(
  {
    role: {
        type: String,
        required: true,
        unique: true,
        enum: [roles.ADMIN, roles.EDITOR, roles.VIEWER], 
      },
    permissions: {
      type: [String], 
      required: true,
      enum: [permissions.READ, permissions.WRITE, permissions.DELETE, permissions.UPDATE, permissions.MANAGE_USERS, permissions.VIEW_LOGS]
    },
  },
  { timestamps: true } 
);

const UserRole = mongoose.model<IUserRole>('UserRole', UserRoleSchema);

export default UserRole;
