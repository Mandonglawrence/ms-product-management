import { Request, Response } from 'express';
import AuthService from '../../application/services/AuthService'; // Adjust the import path
import Logger from '../../infrastructure/logging/Logger'; // Your Winston logger

class AuthController {
  // private member for the AuthService instance
  private readonly authService: AuthService;

  // Constructor to initialize the AuthService
  public constructor() {
    this.authService = new AuthService();
  }

  // Register a new user (public as it is a controller method)
  public registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.authService.register(userData);
      Logger.info(`User registered successfully: ${user.email}`);
      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to register user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(500).json({
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // User login (public as it is a controller method)
  public loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);
      Logger.info(`User logged in successfully: ${user.email}`);
      res.status(200).json({
        message: 'User logged in successfully',
        user,
        token,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to login user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(401).json({
        message: 'Failed to login',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Verify JWT token (public as it is a controller method)
  public verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      const { user } = await this.authService.verifyToken(token);
      Logger.info(`Token verified successfully for user: ${user.email}`);
      res.status(200).json({
        message: 'Token verified successfully',
        user,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to verify token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(401).json({
        message: 'Failed to verify token',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Refresh JWT token (public as it is a controller method)
  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      const newToken = await this.authService.refreshToken(token);
      Logger.info('Token refreshed successfully');
      res.status(200).json({
        message: 'Token refreshed successfully',
        token: newToken,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(401).json({
        message: 'Failed to refresh token',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Change user password (public as it is a controller method)
  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, oldPassword, newPassword } = req.body; // Explicitly extract variables
      const message = await this.authService.changePassword(userId, oldPassword, newPassword);
      Logger.info(`Password changed successfully for user ID: ${userId}`);
      res.status(200).json({
        message,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to change password for user ID ${req.body.userId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(400).json({
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Forgot password (public as it is a controller method)
  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body; // Explicitly extract email
    try {
      const message = await this.authService.forgotPassword(email);
      Logger.info(`Password reset email sent to: ${email}`);
      res.status(200).json({
        message,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to process forgot password request for email ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(400).json({
        message: 'Failed to process forgot password request',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Reset password (public as it is a controller method)
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body; // Explicitly extract variables
    try {
      const message = await this.authService.resetPassword(token, newPassword);
      Logger.info(`Password reset successfully for token: ${token}`);
      res.status(200).json({
        message,
      });
    } catch (error: unknown) {
      Logger.error(`Failed to reset password for token ${token}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(400).json({
        message: 'Failed to reset password',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default AuthController;
