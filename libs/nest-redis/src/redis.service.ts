import { RedisModuleOptions } from './redis.interface';
import {Redis} from 'ioredis';
import { Logger } from '@nestjs/common';

export class RedisService {
  private defaultLabel = Symbol('default_redis_label');
  private clientMap: Map<symbol, Redis> = new Map<
    any,
    Redis
  >();
  private logger: Logger = new Logger(RedisService.name);

  constructor(private options: RedisModuleOptions | RedisModuleOptions[]) {
    try {
      if (options instanceof Array) {
        for (const option of options) {
          const client = new Redis(option);
          this.clientMap.set(Symbol(`redis_label_${option.name}`), client);
        }
      } else {
        this.clientMap.set(this.defaultLabel, new Redis(options));
      }
    } catch (e) {
      this.logger.error(e.message, e);
      throw e;
    }
  }

  getClient(label?: string): Redis {
    let client: Redis;
    if (!label) {
      client = this.clientMap.get(this.defaultLabel);
    } else {
      client = this.clientMap.get(Symbol(`redis_label_${label}`));
    }
    if (!client) {
      throw new Error(`No client[${label}]`);
    }
    return client;
  }
}
