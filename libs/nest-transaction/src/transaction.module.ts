import { DynamicModule, Module } from '@nestjs/common';

import {
  initializeTransactionalContext,
} from 'typeorm-transactional';

@Module({})
export class TransactionModule {
  public static registerAsync(): DynamicModule {
    initializeTransactionalContext();
    return {
      module: TransactionModule,
      providers: [],
      exports: [],
    };
  }
}
