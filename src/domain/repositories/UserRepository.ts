import { IUser } from '../entities/User';

// Define the interface for the user repository
export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
}
