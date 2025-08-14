import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../interfaces/user.repository.interface';

const prisma = new PrismaClient();
export class UserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.error(`Error fetching users: ${error}`);
      throw error;
    }
  }
  async getById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Errow while getting user by id: ${error}`);
      throw error;
    }
  }
  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      return await prisma.user.create({
        data: user,
      });
    } catch (error) {
      console.error(`Error while creating a user ${error}`);
      throw error;
    }
  }
  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null; // no user found
      }
      console.error(`Error while updating user ${error}`);
      throw error;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false; // nothing deleted
      }
      console.error(`Error while deleting user: ${error}`);
      throw error;
    }
  }
}
