import { ModuleMetadata } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { DataSourceOptions, Repository } from 'typeorm';
import { WrapInTransactionOptions } from 'typeorm-transactional';
import { Transactional as HslTransactional } from 'typeorm-transactional';


export const _TypeormRepository_metakey = 'entity_type_name';

export function TypeormRepository(type: any): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(_TypeormRepository_metakey, [type], target);
    return target;
  };
}

export interface TypeOrmPlusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  datasource?: string;
  repository: Array<Constructor<Repository<any>>>;
  useFactory?: (...args: any[]) => Promise<TypeOrmPlusModuleOptions> | TypeOrmPlusModuleOptions;
  imports?: any[];
  inject?: any[];
}

export type TypeOrmPlusModuleOptions = {} & DataSourceOptions;

export const CONFIG_PROVIDER_NAME = 'TYPEORM_PLUS_CONFIG_PROVIDER_NAME';

export function getDataSourceProviderName(name?: string): string {
  return `TYPEORM_${name || 'DEFAULT'}_DATASOURCE`;
}


export function Transactional(options: TransactionalOptions = {}): MethodDecorator {
  return HslTransactional({
    ...options,
    name: getDataSourceProviderName(options.name as string),
    connectionName: getDataSourceProviderName(options.connectionName),
  });
}

export const TypeormTransactional = Transactional;
export type TransactionalOptions = WrapInTransactionOptions

export {
  runInTransaction,
  runOnTransactionCommit,
  runOnTransactionComplete,
  runOnTransactionRollback,
  getDataSourceByName,
} from 'typeorm-transactional';


