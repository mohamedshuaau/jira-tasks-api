import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get the user by username
   *
   * @param username
   */
  async findUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Could not find the user');
    }

    return user;
  }
}
