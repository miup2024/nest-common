import { FactoryProvider, Global, Logger, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  _TypeormRepository_metakey,
  CONFIG_PROVIDER_NAME,
  getDataSourceProviderName,
  TypeOrmPlusModuleAsyncOptions,
  TypeOrmPlusModuleOptions,
} from './const';
import { TypeOrmLogger } from './logger';
import { addTransactionalDataSource, initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

initializeTransactionalContext({
  maxHookHandlers: Number.MAX_VALUE,
  storageDriver: StorageDriver.CLS_HOOKED,
});

@Module({})
@Global()
export class TypeormPlusModule {

  private static logger = new Logger(TypeormPlusModule.name);

  public static registerAsync(options: TypeOrmPlusModuleAsyncOptions) {
    const configProvider = {
      provide: CONFIG_PROVIDER_NAME,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const entityList = options.repository.map((repository) => {
      const entityClass: any = Reflect.getMetadata(_TypeormRepository_metakey, repository);
      if (entityClass && entityClass.length > 0) return entityClass[0];
    });

    const dataSourceToken = getDataSourceProviderName(options.datasource);
    const datasourceProvider = {
      provide: dataSourceToken,
      useFactory: async (config: TypeOrmPlusModuleOptions): Promise<DataSource> => {
        const dataSource = new DataSource({
          ...config,
          synchronize: true,
          logger: config.logger ? new TypeOrmLogger(config) : null,
          entities: entityList,
        });
        await dataSource.initialize();
        this.logger.log(`init datasource [${dataSourceToken}] success`);
        return addTransactionalDataSource({
          dataSource,
          name: dataSourceToken,
        });
      },
      inject: [CONFIG_PROVIDER_NAME],
    };
    const repositoryProviders: Array<FactoryProvider> = [];
    for (const repository of options.repository) {
      const entityClassList: any = Reflect.getMetadata(_TypeormRepository_metakey, repository);
      if (!entityClassList || entityClassList.length <= 0) {
        continue;
      }
      const entityClass = entityClassList[0];
      repositoryProviders.push({
        provide: repository,
        useFactory(dataSource: DataSource) {
          return new repository(entityClass, dataSource.manager, dataSource.manager.queryRunner);
        },
        inject: [datasourceProvider.provide],
      });
    }

    return {
      module: TypeormPlusModule,
      providers: [configProvider, datasourceProvider, ...repositoryProviders],
      imports: [...(options.imports || [])],
      exports: [configProvider, datasourceProvider, ...repositoryProviders],
    };
  }


}
