import { Injectable } from '@nestjs/common';
import { BaseTransformer } from '../../core/base-transformer';
import { Key } from '../../types/transformer-types';

@Injectable()
export class ProjectTransformer extends BaseTransformer {
  constructor() {
    const keys: Key[] = [
      {
        key: 'project_id',
        value: 'project_id',
      },
      {
        key: 'name',
        value: 'name',
      },
      {
        key: 'key',
        value: 'key',
      },
      {
        key: 'avatar',
        value: 'avatar',
      },
    ];
    super(keys);
  }
}
