import { DecodedToken } from '../types/express';
import { IUser } from '../domain/entities/User';

export interface IAuthService {
  /**
   * Registers a new user.
   * @param userData - The user data to register.
   * @returns The registered user.
   */
  register(userData: IUser): Promise<IUser>;

  /**
   * Authenticates a user based on email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The authenticated user with a token.
   */
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;

  /**
   * Verifies a JWT token and returns the decoded user data.
   * @param token - The JWT token to verify.
   * @returns The decoded user data.
   */
  verifyToken(token: string): Promise<{
    user: IUser;
    roles: DecodedToken['roles'];
  }>;

  /**
   * Refreshes a JWT token.
   * @param token - The old JWT token to refresh.
   * @returns A new JWT token.
   */
  refreshToken(token: string): Promise<string>;

  /**
   * Changes the password for a user.
   * @param userId - The ID of the user whose password is to be changed.
   * @param oldPassword - The current password of the user.
   * @param newPassword - The new password to set.
   * @returns A confirmation message or the updated user.
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<string>;

  /**
   * Initiates the password reset process.
   * @param email - The email of the user requesting the password reset.
   * @returns A confirmation message or an instruction to check their email.
   */
  forgotPassword(email: string): Promise<string>;

  /**
   * Resets the password using a token.
   * @param token - The reset token sent to the user's email.
   * @param newPassword - The new password to set.
   * @returns A confirmation message or the updated user.
   */
  resetPassword(token: string, newPassword: string): Promise<string>;
}
