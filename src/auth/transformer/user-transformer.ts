import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '../../core/base-transformer';
import { Key } from '../../types/transformer-types';

@Injectable()
export class UserTransformer extends BaseTransformer {
  constructor() {
    const keys: Key[] = [
      {
        key: 'name',
        value: 'name',
      },
      {
        key: 'username',
        value: 'username',
      },
      {
        key: 'email',
        value: 'email',
      },
      {
        key: 'access_token',
        value: 'access_token',
      },
      {
        key: 'jira_email',
        value: 'jira_email',
      },
      {
        key: 'jira_pat',
        value: 'jira_pat',
      },
    ];
    super(keys);
  }
}
