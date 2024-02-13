import { BaseTransformer } from '../core/base-transformer';

export interface Key {
  key: string;
  value: string;
  as?: string;
  transformer?: typeof BaseTransformer;
  mutate?: (data: object) => object | string;
}
