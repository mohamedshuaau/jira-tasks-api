import { Key } from '../types/transformer-types';

export class BaseTransformer {
  private readonly keys: Array<Key>;

  constructor(keys: Array<Key> = null) {
    this.keys = keys;
  }

  transformObject(record: object, withData: boolean = true): object {
    const data = this.keysToObject(this.keys, record);

    if (withData) {
      return {
        data,
      };
    }

    return data;
  }

  transformArray(data: {
    meta?: object;
    data?: object[];
    map?: (arg0: (object: object) => NonNullable<object>) => object;
  }): object {
    if (data.meta) {
      data.data = data.data.map((object) =>
        this.transformObject(object, false),
      );
      return data;
    }
    return data.map((object) => this.transformObject(object, false));
  }

  keysToObject(keys: Key[], data: object): object {
    const _data = {};
    keys.forEach((key) => {
      // checks if a transformer is present
      // if it is, then check if the value is an array or object
      // if an object, transform to an object. if is an array, transform to an array
      if (key.transformer && data[key.value]) {
        if (Array.isArray(data[key.value])) {
          _data[key.key] = new key.transformer().transformArray(
            data[key.value],
          );
        } else {
          _data[key.key] = new key.transformer().transformObject(
            data[key.value],
            false,
          );
        }
        return;
      }
      // if mutable is present, consider it as a function
      if (key.mutate && data[key.value]) {
        // if key has "as" then modify the key
        if (key.as) {
          _data[key.as] = key.mutate(data);
          return;
        }
        _data[key.key] = key.mutate(data);
        return;
      }
      // if key has "as" then change the key to the value of "as"
      if (key.as && data[key.value]) {
        _data[key.as] = data[key.value];
        return;
      }
      _data[key.key] = data[key.value];
    });

    return _data;
  }

  sendResponse(
    code: number,
    data: object | string,
    object: boolean = true,
  ): string | object {
    if (object) {
      return {
        data: {
          code,
          data,
        },
      };
    }
    return data;
  }
}
