import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { getPrismaExtensions } from './prisma.extensions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public prisma: ReturnType<typeof getPrismaExtensions>;
  public configService: ConfigService;

  async onModuleInit(): Promise<void> {
    this.$connect();

    this.prisma = getPrismaExtensions(this);
    this.configService = new ConfigService();
  }

  /**
   * Prisma Transaction
   * Max timeout and wait time set from env
   *
   * @param callback
   */
  transaction(callback: CallableFunction): Promise<object> {
    return this.$transaction(
      async (tx) => {
        return await callback(tx);
      },
      {
        maxWait: parseInt(<string>this.configService.get('TX_MAX_WAIT')),
        timeout: parseInt(<string>this.configService.get('TX_TIMEOUT')),
      },
    );
  }
}
