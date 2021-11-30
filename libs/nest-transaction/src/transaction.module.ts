import { DynamicModule, Module } from '@nestjs/common';

import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

@Module({})
export class TransactionModule {
  public static register(): DynamicModule {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
    return {
      module: TransactionModule,
      providers: [],
      exports: [],
    };
  }
}
