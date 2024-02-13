import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApplication(): string {
    return 'running';
  }
}
