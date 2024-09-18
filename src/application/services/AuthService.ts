import { IAuthService } from '../../interfaces/IAuthService';
import { IUser } from '../../domain/entities/User';
import UserModel from '../../domain/entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import emailService from '../../infrastructure/EmailService';
import config from "../../config/config"
import { DecodedToken } from '../../types/express';

class AuthService implements IAuthService {
  async register(userData: IUser): Promise<IUser> {
    userData.password = await bcrypt.hash(userData.password, 10);
    
    const user = await UserModel.create(userData);
    await emailService.sendMail({
      to: user.email,
      subject: 'Welcome to Our Service',
      text: `Hello ${user.username},\n\nThank you for registering with us!`,
    });

    return user;
  }

  async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await UserModel.findOne({ email }).populate('roles'); // Populate roles for the user
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
  
    // Include roles in the token payload
    const token = jwt.sign(
      { id: user._id, roles: user.roles }, // Include roles in the payload
      config.jwtSecret,
      { expiresIn: '1h' }
    );
  
    return { user, token };
  }

  async verifyToken(token: string): Promise<{ user: IUser; roles: DecodedToken['roles'] }> {
    try {
      // Decode the token and get user id and roles
      const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;
  
      // Fetch the user by their ID from the database
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Return the user and roles from the decoded token
      return { user, roles: decoded.roles };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(token: string): Promise<string> {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    return jwt.sign({ id: decoded.id }, config.jwtSecret, { expiresIn: '1h' });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await UserModel.findById(userId);
    if (!user || !(await user.comparePassword(oldPassword))) {
      throw new Error('Invalid old password');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return 'Password updated successfully';
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User with this email does not exist');
    }

    const resetToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await emailService.sendMail({
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, use this token: ${resetToken}`,
    });

    return 'Password reset email sent';
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    const user = await UserModel.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() } // Ensure token has not expired
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return 'Password reset successfully';
  }
}

export default AuthService;
