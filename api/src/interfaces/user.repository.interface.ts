import { IUser } from '../models/user.interface';

export interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  create(user: Omit<IUser, 'id'>): Promise<IUser>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}
