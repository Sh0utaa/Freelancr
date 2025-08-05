import { IUserRepository } from '../interfaces/user.repository.interface';
import { IUser } from '../models/user.interface';

export class UserRepository implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }
  async getById(id: string): Promise<IUser | null> {
    throw new Error('Method not implemented.');
  }
  async create(user: Omit<IUser, 'id'>): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
