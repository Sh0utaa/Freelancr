import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

  async login(email: string, password: string): Promise<string> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Please provide a proper email address');
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new Error(`Account with the email of ${email} doesn't exist`);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid password');

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '72h',
      },
    );

    return token;
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

  async update(email: string, user: Partial<publicUser>): Promise<User | null> {
    try {
      const updateData: Partial<User> = {};

      if (user.username) {
        var res = await validator.validateUsername(user.username);
        if (res.success) updateData.username = res.value;
        else throw new Error(res.error);
      }
      if (user.email) {
        var res = await validator.validateEmail(user.email);
        if (res.success) updateData.email = res.value;
        else throw new Error(res.error);
      }
      if (user.password) {
        var res = await validator.validatePassword(user.password);
        if (res.success) {
          updateData.password = await bcrypt.hash(user.password, 10);
        } else throw new Error(res.error);
      }
      if (user.pictureUrl) {
        // todo
        updateData.pictureUrl = user.pictureUrl;
      }
      if (user.birthDate) {
        let res = await validator.parseBirthday(user.birthDate);
        if (res.success) updateData.birthDate = res.value;
        else throw new Error(res.error);
      }

      return await prisma.user.update({
        where: { email },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      console.error(`Error while updating user ${error}`);
      throw error;
    }
  }

  async delete(email: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { email },
      });

      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false;
      }
      console.error(`Error while deleting user: ${error}`);
      throw error;
    }
  }
}
