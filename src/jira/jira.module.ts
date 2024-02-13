import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { JiraController } from './jira.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [HttpModule],
  controllers: [JiraController],
  providers: [JiraService, PrismaService, LoggerService],
})
export class JiraModule {}
