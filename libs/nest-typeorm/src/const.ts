import { ModuleMetadata } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { Repository } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionModuleConfig } from '@miup/nest-transaction';

export interface TypeOrmPlusModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  datasource?: string;
  repository: Array<Constructor<Repository<any>>>;
  useFactory?: (...args: any[]) => Promise<TypeOrmPlusModuleOptions> | TypeOrmPlusModuleOptions;
  imports?: any[];
  inject?: any[];
}

export type TypeOrmPlusModuleOptions = {
  transaction?: TransactionModuleConfig;
} & TypeOrmModuleOptions;

export const CONFIG_PROVIDER_NAME = 'TYPEORM_PLUS_CONFIG_PROVIDER_NAME';