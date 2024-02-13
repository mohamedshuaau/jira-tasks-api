import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '../../core/base-transformer';
import { Key } from '../../types/transformer-types';
import * as dayjs from 'dayjs';

@Injectable()
export class IssueTransformer extends BaseTransformer {
  constructor() {
    const keys: Key[] = [
      {
        key: 'issue_id',
        value: 'issue_id',
      },
      {
        key: 'key',
        value: 'key',
      },
      {
        key: 'issue_type',
        value: 'issue_type',
      },
      {
        key: 'summary',
        value: 'summary',
      },
      {
        key: 'status',
        value: 'status',
      },
      {
        key: 'due_date',
        value: 'due_date',
        mutate: IssueTransformer.formatDueDate,
      },
      {
        key: 'created_at',
        value: 'created_at',
        mutate: IssueTransformer.formatCreatedDate,
      },
    ];
    super(keys);
  }

  static formatDueDate(data) {
    return dayjs(data.due_date).format('DD MMM YYYY');
  }

  static formatCreatedDate(data) {
    return dayjs(data.created_at).format('DD MMM YYYY');
  }
}
