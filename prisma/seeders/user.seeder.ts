import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const userSeeder = async (): Promise<void> => {
  const password = await bcrypt.hash('secret', 10);
  await prisma.user.create({
    data: {
      name: 'Mohamed Shuaau',
      email: 'shuaaum@gmail.com',
      username: 'shuaaum',
      password: password,
      jira_email: 'mohammedshuaau@gmail.com',
      jira_pat:
        'ATATT3xFfGF0Vjqx8wWZsmyyAuSiAZB851PAwzPBhHBbnzudNAm4Rlv03iRE8Y8VI64Li05BL4Ewv2UQXMk93UzGaEzDyYxRls0mDuR4gH9nuNEfkgMJ__armnhJ-Rh6rk3EmbPCXrU9dNh6mp3OmF4rYSjnspyxXXGzrhze9bHjKgoHBHXdYCk=425C3ADE',
    },
  });
};
