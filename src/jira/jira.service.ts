import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class JiraService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get Dashboard data
   * Look man. I'm tired. there is a million ways in my head of how I could improve this.
   *
   * @param request
   */
  async getDashboard(request) {
    const recentIssues = await this.prismaService.issue.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 5,
      where: {
        user_id: request.user.id,
      },
    });

    const allIssues = await this.prismaService.issue.findMany({
      where: {
        user_id: request.user.id,
      },
    });
    const openIssues = allIssues.filter(
      (issue) => issue.status === 'Open',
    ).length;
    const doneIssues = allIssues.filter(
      (issue) => issue.status === 'Done',
    ).length;

    const issuesOverview = {
      open: openIssues,
      done: doneIssues,
    };

    const columnChartData = await this.prismaService.issue.groupBy({
      by: ['issue_type', 'status'],
      _count: {
        id: true,
      },
    });

    return {
      recent_issues: recentIssues,
      issues_overview: issuesOverview,
      column_chart: columnChartData,
    };
  }

  /**
   * Fetches all the issues from DB
   */
  async getAllIssues() {
    return await this.prismaService.issue.findMany();
  }

  /**
   * Sync all Issues
   */
  async syncAllIssues(request, project) {
    const jiraBaseUrl = this.configService.get('JIRA_BASE_URL');

    try {
      const response = await this.httpService.axiosRef.post(
        `${jiraBaseUrl}/rest/api/3/search`,
        {
          jql: project ? `project = ${project}` : `project is not empty`,
        },
        this.prepareHeaders(request),
      );

      const _project = await this.prismaService.project.findFirst({
        where: {
          key: {
            equals: project,
          },
        },
      });

      if (!_project) {
        throw new BadRequestException('Project not found!');
      }

      for (const issue of response.data.issues) {
        await this.prismaService.issue.upsert({
          where: { issue_id: issue.id },
          update: {
            issue_type: issue.fields.issuetype.name,
            summary: issue.fields.summary,
            status: issue.fields.status.name,
            status_update_date: dayjs(
              issue.fields.statuscategorychangedate,
            ).toISOString(),
            due_date: issue.fields.duedate
              ? dayjs(issue.fields.duedate).toISOString()
              : null,
          },
          create: {
            user_id: request.user.id,
            project_id: _project?.id,
            issue_id: issue.id,
            issue_type: issue.fields.issuetype.name,
            summary: issue.fields.summary,
            status: issue.fields.status.name,
            status_update_date: dayjs(
              issue.fields.statuscategorychangedate,
            ).toISOString(),
            due_date: issue.fields.duedate
              ? dayjs(issue.fields.duedate).toISOString()
              : null,
          },
        });
      }
    } catch (error) {
      this.loggerService.error(
        'Something went wrong while trying to sync issues',
        error,
      );
    }
  }

  /**
   * Fetches all the projects from DB
   */
  async getAllProjects() {
    return await this.prismaService.project.findMany();
  }

  /**
   * Syncs all projects to the DB
   * If the project exists, ignore it
   *
   * @param request
   */
  async syncAllProjects(request) {
    const jiraBaseUrl = this.configService.get('JIRA_BASE_URL');

    try {
      const response = await this.httpService.axiosRef.get(
        `${jiraBaseUrl}/rest/api/3/project`,
        this.prepareHeaders(request),
      );

      // each project should either be updated or created as new.
      // it only makes sense to update an existing project otherwise it's not in "sync"
      for (const project of response.data) {
        await this.prismaService.project.upsert({
          where: { project_id: project.id },
          update: {
            name: project.name,
            key: project.key,
            avatar: project.avatarUrls['48x48'],
          },
          create: {
            project_id: project.id,
            name: project.name,
            key: project.key,
            avatar: project.avatarUrls['48x48'],
          },
        });
      }
    } catch (error) {
      this.loggerService.error(
        'Something went wrong while trying to sync projects',
        error,
      );
    }
  }

  /**
   * Prepares the Header
   * Contains authorization header with base64 user email and pat
   *
   * @param request
   * @param params
   */
  prepareHeaders(request, params = null) {
    if (!request.user.jira_email || !request.user.jira_pat) {
      throw new BadRequestException('Invalid or missing jira details');
    }
    return {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${request.user.jira_email}:${request.user.jira_pat}`,
        ).toString('base64')}`,
        Accept: 'application/json',
      },
      params,
    };
  }
}
