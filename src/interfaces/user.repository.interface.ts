import { User } from '@prisma/client';
import { publicUser } from './publicUser.interface';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'posts'> & {
      birthDate: string;
    },
  ): Promise<User>;
  update(id: string, user: Partial<publicUser>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
