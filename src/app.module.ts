import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JiraModule } from './jira/jira.module';
import { CommandModule } from 'nestjs-command';
import { NotifyPendingIssuesCommand } from './commands/notify-pending-issues.command';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    PrismaModule,
    AuthenticateModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    JiraModule,
    CommandModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotifyPendingIssuesCommand, MailerService],
})
export class AppModule {}
