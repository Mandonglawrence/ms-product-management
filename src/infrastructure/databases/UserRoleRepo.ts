import { IUserRole } from '../../domain/entities/UserRole';
import UserRole from '../../domain/entities/UserRole';
import Logger from '../logging/Logger'; // Import logger

class UserRoleRepository {
  // Create a new role
  async create(roleData: IUserRole): Promise<IUserRole> {
    try {
      const newRole = new UserRole(roleData);
      const savedRole = await newRole.save();
      Logger.info(`Role created: ${savedRole.name}`);
      return savedRole;
    } catch (error: unknown) {
      Logger.error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Find role by ID
  async findById(roleId: string): Promise<IUserRole | null> {
    try {
      const role = await UserRole.findById(roleId).exec();
      if (role) {
        Logger.info(`Role found by ID: ${role.name}`);
      } else {
        Logger.warn(`Role not found by ID: ${roleId}`);
      }
      return role;
    } catch (error: unknown) {
      Logger.error(`Failed to find role by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Find role by name
  async findByName(name: string): Promise<IUserRole | null> {
    try {
      const role = await UserRole.findOne({ name }).exec();
      if (role) {
        Logger.info(`Role found by name: ${role.name}`);
      } else {
        Logger.warn(`Role not found by name: ${name}`);
      }
      return role;
    } catch (error: unknown) {
      Logger.error(`Failed to find role by name: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Get all roles
  async findAll(): Promise<IUserRole[]> {
    try {
      const roles = await UserRole.find().exec();
      Logger.info(`Retrieved ${roles.length} roles`);
      return roles;
    } catch (error: unknown) {
      Logger.error(`Failed to retrieve roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Update role by ID
  async update(roleId: string, roleData: Partial<IUserRole>): Promise<IUserRole | null> {
    try {
      const updatedRole = await UserRole.findByIdAndUpdate(roleId, roleData, { new: true }).exec();
      if (updatedRole) {
        Logger.info(`Role updated: ${updatedRole.name}`);
      } else {
        Logger.warn(`Role not found for update: ID ${roleId}`);
      }
      return updatedRole;
    } catch (error: unknown) {
      Logger.error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // Delete role by ID
  async delete(roleId: string): Promise<IUserRole | null> {
    try {
      const deletedRole = await UserRole.findByIdAndDelete(roleId).exec();
      if (deletedRole) {
        Logger.info(`Role deleted: ${deletedRole.name}`);
      } else {
        Logger.warn(`Role not found for deletion: ID ${roleId}`);
      }
      return deletedRole;
    } catch (error: unknown) {
      Logger.error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  // New method: Find roles by an array of role IDs
  async findRolesByIds(roleIds: IUserRole[]): Promise<IUserRole[]> {
    try {
      const roles = await UserRole.find({ _id: { $in: roleIds } }).exec();
      if (roles.length > 0) {
        Logger.info(`Found ${roles.length} roles for the provided IDs`);
      } else {
        Logger.warn(`No roles found for the provided IDs`);
      }
      return roles;
    } catch (error: unknown) {
      Logger.error(`Failed to find roles by IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}

export default UserRoleRepository;
