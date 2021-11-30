import { HslTransactional, IsolationLevel, Propagation } from './cmob';

export * from './transaction.module';
export * from './cmob';

export interface TransactionalOptions {
  connectionName?: string | (() => string | undefined);
  propagation?: Propagation;
  isolationLevel?: IsolationLevel;
}

export function Transactional(options?: TransactionalOptions): MethodDecorator {
  return HslTransactional(options);
}
