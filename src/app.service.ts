import { Injectable } from '@nestjs/common';
import { RedisService } from '@miup/nest-redis';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
