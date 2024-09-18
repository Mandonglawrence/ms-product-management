import { Request, Response } from 'express';
import EmailService from '../../infrastructure/EmailService';
import { IUser } from '../../domain/entities/User';
import UserRepository from '../../infrastructure/databases/MongoUserRepo';
import Logger from '../../infrastructure/logging/Logger'; // Corrected import path

class UserController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    // Create a new user
    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
          const userData: IUser = req.body;
          const user = await this.userRepository.create(userData);
    
          // Send welcome email
          try {
            await EmailService.sendMail({
              to: user.email,
              subject: 'Welcome to Our Service',
              text: `Hello ${user.username},\n\nThank you for registering! We’re excited to have you onboard.`,
            });
            Logger.info(`Welcome email sent to ${user.email}`);
          } catch (emailError) {
            Logger.error(`Failed to send welcome email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`);
          }
    
          res.status(201).json({
            message: 'User created successfully',
            user,
          });
        } catch (error: unknown) {
          Logger.error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
          res.status(500).json({
            message: 'Failed to create user',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      };

    // Get a user by ID
    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await this.userRepository.findById(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        } catch (error: unknown) {
            Logger.error(`Failed to retrieve user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
            res.status(500).json({
                message: 'Failed to retrieve user',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Get a user by email
    public getUserByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = req.params.email;
            const user = await this.userRepository.findByEmail(email);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        } catch (error: unknown) {
            Logger.error(`Failed to retrieve user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
            res.status(500).json({
                message: 'Failed to retrieve user',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Update a user by ID
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const userData: Partial<IUser> = req.body;
            const updatedUser = await this.userRepository.update(userId, userData);
            if (updatedUser) {
                res.status(200).json({
                    message: 'User updated successfully',
                    user: updatedUser,
                });
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        } catch (error: unknown) {
            Logger.error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
            res.status(500).json({
                message: 'Failed to update user',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Delete a user by ID
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userRepository.delete(userId);
            if (deletedUser) {
                res.status(200).json({
                    message: 'User deleted successfully',
                    user: deletedUser,
                });
            } else {
                res.status(404).json({
                    message: 'User not found',
                });
            }
        } catch (error: unknown) {
            Logger.error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
            res.status(500).json({
                message: 'Failed to delete user',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}

export default new UserController();
