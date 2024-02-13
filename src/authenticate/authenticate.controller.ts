import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { Response } from 'express';

@Controller('api/v1/authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Get()
  authenticate(@Res() response: Response) {
    return this.authenticateService.authenticate(response);
  }

  @Get('callback')
  async handleCallback(
    @Query('state') state: string,
    @Query('code') code: string,
  ) {
    await this.authenticateService.handleCallback(state, code);
  }
}
