import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { publicUser } from '../interfaces/publicUser.interface';
import { Validator } from '../services/validator';

const validator = new Validator();
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
      console.error(`Errow while getting user by mail: ${error}`);
      throw error;
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error(`Errow while getting user by mail: ${error}`);
      throw error;
    }
  }

  async create(user: publicUser): Promise<User> {
    try {
      var validatedResult = await validator.validateUser(user);
      if (validatedResult.success !== true) {
        throw new Error(validatedResult.error);
      }

      var birthDateResult = await validator.parseBirthday(user.birthDate);
      if (birthDateResult.success !== true) {
        throw new Error(birthDateResult.error);
      }

      let hashedPassword = await bcrypt.hash(user.password, 10);

      return await prisma.user.create({
        data: { ...user, birthDate: birthDateResult.value, password: hashedPassword },
      });
    } catch (error) {
      console.error(`Error while creating a user ${error}`);
      throw error;
    }
  }

  async update(id: string, user: Partial<publicUser>): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
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
