import { HslTransactional } from './cmob';
import { WrapInTransactionOptions } from 'typeorm-transactional/dist/transactions/wrap-in-transaction';

export * from './transaction.module';
export * from './cmob';

export type TransactionalOptions = WrapInTransactionOptions

export function Transactional(options?: TransactionalOptions): MethodDecorator {
  return HslTransactional(options);
}
