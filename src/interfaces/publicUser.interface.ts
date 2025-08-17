import { User } from '@prisma/client';

export type publicUser = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'posts' | 'birthDate'
> & {
  birthDate: string;
};
