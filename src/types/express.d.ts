import { IUser } from '../domain/entities/User';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>; // Extend the Request interface to include a user property
    }
  }
}

interface DecodedToken {
  id: string;
  roles: { _id: string; name: string; permissions: string[] }[]; // Include roles structure
}
