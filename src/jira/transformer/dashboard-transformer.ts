import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '../../core/base-transformer';
import { Key } from '../../types/transformer-types';
import { IssueTransformer } from './issue-transformer';

@Injectable()
export class DashboardTransformer extends BaseTransformer {
  constructor() {
    const keys: Key[] = [
      {
        key: 'recent_issues',
        value: 'recent_issues',
        transformer: IssueTransformer,
      },
      {
        key: 'issues_overview',
        value: 'issues_overview',
      },
      {
        key: 'column_chart',
        value: 'column_chart',
      },
    ];
    super(keys);
  }
}
