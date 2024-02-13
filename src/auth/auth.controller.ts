import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserTransformer } from './transformer/user-transformer';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@UsePipes(ZodValidationPipe)
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() loginDto: LoginDto) {
    const data = await this.authService.signIn(
      loginDto.username,
      loginDto.password,
    );
    return new UserTransformer().transformObject(data);
  }

  @UseGuards(AuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Req() request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const data = await this.authService.updateProfile(
      request,
      updateProfileDto,
    );
    return new UserTransformer().transformObject(data);
  }

  @UseGuards(AuthGuard)
  @Get('current-user')
  async getCurrentUser(@Req() request) {
    const data = await this.authService.getCurrentUser(request);
    return new UserTransformer().transformObject(data);
  }
}
