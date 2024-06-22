import { HslTransactional } from './cmob';
import { WrapInTransactionOptions } from 'typeorm-transactional';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export * from './transaction.module';
export * from './cmob';

export type TransactionalOptions = WrapInTransactionOptions

export function Transactional(options?: TransactionalOptions): MethodDecorator {
  return HslTransactional(options);
}

export const TRANSACTION_CONFIG_NAME = 'PROVIDER_BASE_TRANSACTION_MODULE_OPTION_NAME';


export interface TransactionSyncModuleConfig extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<TransactionModuleConfig> | TransactionModuleConfig;
  inject?: any[];
}

export class TransactionModuleConfig {
  dataSources?: string[];


  /**
   * ontrols how many hooks (commit, rollback, complete) can be used simultaneously.
   * If you exceed the number of hooks of same type, you get a warning.
   * This is a useful to find possible memory leaks.
   * You can set this options to 0 or Infinity to indicate an unlimited number of listeners.
   */
  maxHookHandlers?: number;
  /**
   * AUTO
   * Controls storage driver used for providing persistency during the async request timespan.
   * You can force any of the available drivers with this option.
   * By default, the modern AsyncLocalStorage will be preferred, if it is supported by your runtime.
   */
  /**
   * CLS_HOOKED
   * Uses AsyncLocalStorage when node >= 16 and cls-hooked otherwise
   *
   * ASYNC_LOCAL_STORAGE
   * Supports legacy node versions
   * Uses AcyncWrap for node < 8.2.1 and async_hooks otherwise
   * Uses AsyncLocalStorage which is available sice node 16
   */
  storageDriver?: 'AUTO' | 'CLS_HOOKED' | 'ASYNC_LOCAL_STORAGE';
}
