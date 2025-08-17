import { PrismaClient } from '@prisma/client';
import { publicUser } from '../interfaces/publicUser.interface';

export type ValidationResult<T> = { success: true; value: T } | { success: false; error: string };
const prisma = new PrismaClient();

export class Validator {
  async validateUser(user: publicUser): Promise<ValidationResult<publicUser>> {
    const emailStatus = await this.validateEmail(user.email);
    if (!emailStatus.success) return emailStatus;

    const usernameStatus = await this.validateUsername(user.username);
    if (!usernameStatus.success) return usernameStatus;

    const passwordStatus = await this.validatePassword(user.password);
    if (!passwordStatus.success) return passwordStatus;

    return { success: true, value: user };
  }

  public async parseBirthday(input: string): Promise<ValidationResult<Date>> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
      return { success: false, error: 'birthDate must be in YYYY-MM-DD format' };
    }

    const date = new Date(input + 'T00:00:00Z');

    if (isNaN(date.getTime())) {
      return { success: false, error: 'Invalid birthDate value' };
    }

    return { success: true, value: date };
  }

  public async validateUsername(username: string): Promise<ValidationResult<string>> {
    if (
      await prisma.user.findFirst({
        where: { username },
      })
    ) {
      return { success: false, error: 'User with this username is already registered' };
    }

    if (username.length < 5) {
      return { success: false, error: 'Username must be at least 5 characters long' };
    }

    return { success: true, value: username };
  }

  public async validateEmail(email: string): Promise<ValidationResult<string>> {
    if (
      await prisma.user.findFirst({
        where: { email },
      })
    ) {
      return { success: false, error: 'User with this email is already registered' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please provide a valid email address' };
    }

    return { success: true, value: email };
  }

  public async validatePassword(password: string): Promise<ValidationResult<string>> {
    if (password.length <= 6) {
      return { success: false, error: 'Password must be longer than 6 characters' };
    }

    if (!/[A-Z]/.test(password)) {
      return { success: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { success: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { success: false, error: 'Password must contain at least one number' };
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return { success: false, error: 'Password must contain at least one special character' };
    }

    return { success: true, value: password };
  }
}
