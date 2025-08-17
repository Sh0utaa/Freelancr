import { User } from '@prisma/client';

export type publicUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'posts' | 'birthDate' | 'role'
> & {
  birthDate: string;
};

export type loginForm = {
  email: string;
  password: string;
};
