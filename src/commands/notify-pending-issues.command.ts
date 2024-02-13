import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
import * as dayjs from 'dayjs';

@Injectable()
export class NotifyPendingIssuesCommand {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * Gets all the issues associated to a user and sends a notification to the user with pending/open issues which are
   */
  @Command({
    command: 'notify-pending-issues',
    describe: 'Send an email notification for the pending issues',
  })
  async notifyPendingIssues() {
    const issues = await this.prismaService.issue.findMany({
      where: {
        status: {
          in: ['open'],
        },
        due_date: {
          gt: dayjs().toISOString(),
        },
      },
      include: {
        user: true,
      },
    });

    const transformedData = issues.reduce((acc, curr) => {
      const userId = curr.user.id;
      const existing = acc.find((user) => user.id === userId);
      const issue = { issue_id: curr.issue_id };

      if (existing) {
        existing.issues.push(issue);
      } else {
        acc.push({
          id: userId,
          email: curr.user.email,
          issues: [issue],
        });
      }

      return acc;
    }, []);

    for (const datum of transformedData) {
      let emailText =
        'Hello \n\nPlease find the list of pending tasks that has not yet been resolved:\n\n';
      datum.issues.forEach((issue) => {
        emailText += `Issue Number: ${issue.issue_id}\n`;
      });
      emailText += '\n\nThank you!';

      await this.mailerService.sendEmail(
        datum.email,
        'Pending Tasks',
        emailText,
      );
    }
  }
}
