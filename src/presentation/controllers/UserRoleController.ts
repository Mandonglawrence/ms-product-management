import { Request, Response } from 'express';
import UserRoleRepository from '../../infrastructure/databases/UserRoleRepo';
import { IUserRole } from '../../domain/entities/UserRole';
import Logger from '../../infrastructure/logging/Logger'; 

class UserRoleController {
  private userRoleRepository: UserRoleRepository;

  constructor() {
    this.userRoleRepository = new UserRoleRepository();
  }

  // Create a new role
  public createRole = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("got here");
      
      const roleData: IUserRole = req.body;
      const newRole = await this.userRoleRepository.create(roleData);
      Logger.info(`Role created: ${newRole.name}`);
      res.status(201).json({
        message: 'Role created successfully',
        role: newRole,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to create role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Get a role by ID
  public getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const roleId = req.params.id;
      const role = await this.userRoleRepository.findById(roleId);
      if (role) {
        Logger.info(`Role retrieved: ${role.name}`);
        res.status(200).json(role);
      } else {
        Logger.warn(`Role not found: ID ${roleId}`);
        res.status(404).json({
          message: 'Role not found',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to retrieve role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to retrieve role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Get all roles
  public getAllRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
      const roles = await this.userRoleRepository.findAll();
      Logger.info(`Retrieved ${roles.length} roles`);
      res.status(200).json(roles);
    } catch (error: unknown) {
      Logger.error(`Failed to retrieve roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Update a role by ID
  public updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const roleId = req.params.id;
      const roleData: Partial<IUserRole> = req.body;
      const updatedRole = await this.userRoleRepository.update(roleId, roleData);
      if (updatedRole) {
        Logger.info(`Role updated: ${updatedRole.name}`);
        res.status(200).json({
          message: 'Role updated successfully',
          role: updatedRole,
        });
      } else {
        Logger.warn(`Role not found for update: ID ${roleId}`);
        res.status(404).json({
          message: 'Role not found',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to update role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Delete a role by ID
  public deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const roleId = req.params.id;
      const deletedRole = await this.userRoleRepository.delete(roleId);
      if (deletedRole) {
        Logger.info(`Role deleted: ${deletedRole.name}`);
        res.status(200).json({
          message: 'Role deleted successfully',
          role: deletedRole,
        });
      } else {
        Logger.warn(`Role not found for deletion: ID ${roleId}`);
        res.status(404).json({
          message: 'Role not found',
        });
      }
    } catch (error: unknown) {
      Logger.error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to delete role',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

export default new UserRoleController();
