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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoic2h1YWF1bSIsImlhdCI6MTcwNzg0NjkzNiwiZXhwIjoxNzA3ODYxMzM2fQ.r6fWpWMfa-Z5aIuDeYb3U8lxcJ-5HxNER75SmTkyP6g',
    },
  });
};
