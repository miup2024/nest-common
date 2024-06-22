import { DynamicModule, FactoryProvider, Logger, Module, OnApplicationBootstrap, ValueProvider } from '@nestjs/common';
import { TRANSACTION_CONFIG_NAME, TransactionModuleConfig, TransactionSyncModuleConfig } from './index';
import { ModuleRef } from '@nestjs/core';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';


@Module({})
export class TransactionModule implements OnApplicationBootstrap {
  private logger = new Logger(TransactionModule.name);

  public static registerAsync(params: TransactionSyncModuleConfig = {
    useFactory(): Promise<TransactionModuleConfig> {
      return null;
    },
  }): DynamicModule {
    const configProvider: FactoryProvider = {
      provide: TRANSACTION_CONFIG_NAME,
      useFactory: params.useFactory,
      inject: [...(params.inject || [])],
    };
    return {
      module: TransactionModule,
      imports: [...(params.imports || [])],
      providers: [configProvider],
      exports: [],
    };
  }

  public static register(params: TransactionModuleConfig = {}): DynamicModule {
    const configProvider: ValueProvider = {
      provide: TRANSACTION_CONFIG_NAME,
      useValue: params,
    };
    return {
      module: TransactionModule,
      providers: [configProvider],
      exports: [],
    };
  }
  constructor(private readonly moduleRef: ModuleRef) {
  }

  public onApplicationBootstrap() {
    try {
      this.logger.debug('TransactionModule onApplicationBootstrap');
      const conf: TransactionModuleConfig = this.moduleRef.get(TRANSACTION_CONFIG_NAME, { strict: false }) || {};

      initializeTransactionalContext({
        maxHookHandlers: conf.maxHookHandlers,
        storageDriver: (conf.storageDriver || 'AUTO') as any,
      });
      if (!conf || !conf.dataSources || conf.dataSources.length <= 0) {
        this.logger.debug('register dataSources is empty');
        this.moduleRef.get(DataSource, { strict: false });
        addTransactionalDataSource(this.moduleRef.get(DataSource, { strict: false }));
        return;
      }
      for (const dataSourceName of conf.dataSources) {
        this.logger.debug(`register dataSources: ${dataSourceName}`);
        const dataSourceToken = getDataSourceToken(dataSourceName);
        const dataSource = this.moduleRef.get(dataSourceToken, { strict: false });
        addTransactionalDataSource({
          dataSource,
          name: dataSourceName,
        });
      }
    } catch (e) {
      this.logger.error('onApplicationBootstrap error');
      this.logger.error(e.stack);
    }
  }

}
