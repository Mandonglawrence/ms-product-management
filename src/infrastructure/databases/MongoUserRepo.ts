import { IUser } from '../../domain/entities/User'; // Ensure this path is correct
import UserModel from '../../domain/entities/User'; // Ensure this path is correct
import { IUserRepository } from '../../domain/repositories/UserRepository'; // Interface for User repository
import Logger from '../logging/Logger'; // Your Winston logger

class UserRepository implements IUserRepository {
  // Method to create a new user
  async create(userData: IUser): Promise<IUser> {
    try {
      const user = new UserModel(userData);
      await user.save();
      return user.toObject(); // Convert to plain object that matches IUser interface
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Failed to create user: ${error.message}`);
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        Logger.error('Failed to create user due to an unknown error');
        throw new Error('Failed to create user due to an unknown error');
      }
    }
  }

  // Method to find a user by ID
  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id).exec();
      return user ? user.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Failed to find user by ID: ${error.message}`);
        throw new Error(`Failed to find user by ID: ${error.message}`);
      } else {
        Logger.error('Failed to find user by ID due to an unknown error');
        throw new Error('Failed to find user by ID due to an unknown error');
      }
    }
  }

  // Method to find a user by email
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email }).exec();
      return user ? user.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Failed to find user by email: ${error.message}`);
        throw new Error(`Failed to find user by email: ${error.message}`);
      } else {
        Logger.error('Failed to find user by email due to an unknown error');
        throw new Error('Failed to find user by email due to an unknown error');
      }
    }
  }

  // Method to update an existing user
  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, userData, { new: true }).exec();
      return user ? user.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Failed to update user: ${error.message}`);
        throw new Error(`Failed to update user: ${error.message}`);
      } else {
        Logger.error('Failed to update user due to an unknown error');
        throw new Error('Failed to update user due to an unknown error');
      }
    }
  }

  // Method to delete a user by ID
  async delete(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndDelete(id).exec();
      return user ? user.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Failed to delete user: ${error.message}`);
        throw new Error(`Failed to delete user: ${error.message}`);
      } else {
        Logger.error('Failed to delete user due to an unknown error');
        throw new Error('Failed to delete user due to an unknown error');
      }
    }
  }
}

export default UserRepository;
