import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JiraService } from './jira.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectTransformer } from './transformer/project-transformer';
import { IssueTransformer } from './transformer/issue-transformer';
import { DashboardTransformer } from './transformer/dashboard-transformer';

@UsePipes(ZodValidationPipe)
@UseGuards(AuthGuard)
@Controller('api/v1/jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Get('dashboard')
  async getDashboard(@Req() request) {
    const data = await this.jiraService.getDashboard(request);
    return new DashboardTransformer().transformObject(data);
  }

  @Get('projects')
  async getAllProjects() {
    const data = await this.jiraService.getAllProjects();
    return new ProjectTransformer().transformArray(data);
  }

  @Get('projects/sync')
  async syncAllProjects(@Req() request) {
    await this.jiraService.syncAllProjects(request);
    return new ProjectTransformer().sendResponse(
      200,
      'Projects Synced Successfully!',
    );
  }

  @Get('issues')
  async getAllIssues() {
    const data = await this.jiraService.getAllIssues();
    return new IssueTransformer().transformArray(data);
  }

  @Get('issues/sync')
  async syncAllIssues(@Req() request, @Query('project') project: string) {
    await this.jiraService.syncAllIssues(request, project);
    return new IssueTransformer().sendResponse(
      200,
      'Issues Synced Successfully!',
    );
  }
}
