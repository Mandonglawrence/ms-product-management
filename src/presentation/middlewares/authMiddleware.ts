import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../../domain/entities/User'; // Adjust the path as needed
import UserRoleRepository from '../../infrastructure/databases/UserRoleRepo'; // Import the repository to fetch user roles and permissions
import Logger from '../../infrastructure/logging/Logger'; // Logger for error tracking

// Auth Middleware: Verify JWT and attach user to request
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
      req.user = decoded; // Attach user to request

      // Query the user roles and permissions from the database
      const userRoleRepo = new UserRoleRepository();
      const roles = await userRoleRepo.findRolesByIds(decoded.roles); // Assuming decoded.roles contains an array of role IDs

      if (!roles || roles.length === 0) {
        return res.status(403).json({ message: 'No roles assigned to the user' });
      }

      // Attach the roles with permissions to req.user
      req.user.roles = roles;

      next();
    } catch (error) {
      Logger.error(`Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}`);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

// Permission Middleware: Check if user has the required permissions
const permissionMiddleware = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser & { roles: Array<{ permissions: string[] }> };

    if (!user || !user.roles) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if the user has at least one role with the required permissions
    const hasPermission = user.roles.some(role =>
      role.permissions.some(permission => requiredPermissions.includes(permission))
    );

    if (hasPermission) {
      next(); // User has the necessary permissions, proceed to the next middleware
    } else {
      return res.status(403).json({ message: 'You do not have the required permissions' });
    }
  };
};

export { authMiddleware, permissionMiddleware };
