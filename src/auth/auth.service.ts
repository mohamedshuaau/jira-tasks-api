import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Login using username and password
   *
   * @param username
   * @param pass
   */
  async signIn(username: string, pass: string): Promise<object> {
    const user = await this.usersService.findUserByUsername(username);

    const isMatched = await bcrypt.compare(pass, user?.password);
    if (!isMatched) {
      throw new UnauthorizedException('Username or Password is incorrect');
    }
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        access_token: accessToken,
      },
    });

    return updatedUser;
  }

  /**
   * Updates the profile information
   * This updates the Jira email and PAT information
   * But this can be used to update further details in the future
   *
   * @param request
   * @param updateProfileDto
   */
  async updateProfile(request, updateProfileDto: UpdateProfileDto) {
    const data = {
      jira_email: updateProfileDto.jira_email,
      jira_pat: updateProfileDto.jira_pat,
    };

    return await this.prismaService.user.update({
      where: {
        id: request.user.id,
      },
      data,
    });
  }

  /**
   * Get the current user
   *
   * @param request
   */
  async getCurrentUser(request) {
    return await this.prismaService.user.findFirst({
      where: {
        id: request.user.id,
      },
    });
  }
}
