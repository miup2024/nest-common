import { FactoryProvider, Global, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  _TypeormRepository_metakey,
  CONFIG_PROVIDER_NAME,
  getDataSourceProviderName,
  TypeOrmPlusModuleAsyncOptions,
  TypeOrmPlusModuleOptions,
} from './const';
import { TypeOrmLogger } from './logger';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { ModuleRef } from '@nestjs/core';



@Module({})
@Global()
export class TypeormPlusModule implements OnApplicationBootstrap {

  private logger = new Logger(TypeormPlusModule.name);

  constructor(private moduleRef: ModuleRef) {
  }

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

    const datasourceProvider = {
      provide: getDataSourceProviderName(options.datasource),
      useFactory: async (config: TypeOrmPlusModuleOptions) => {
        const dataSource = new DataSource({
          ...config,
          synchronize: true,
          logger: config.logger ? new TypeOrmLogger(config) : null,
          entities: entityList,
        });
        return dataSource.initialize();
      },
      inject: [CONFIG_PROVIDER_NAME],
    };

    console.log(datasourceProvider)

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


  public onApplicationBootstrap() {
    try {
      this.logger.log('register transaction onApplicationBootstrap');
      const conf: TypeOrmPlusModuleOptions = this.moduleRef.get(CONFIG_PROVIDER_NAME, { strict: false });

      initializeTransactionalContext();
      const dataSourceName = conf.name;
      const dataSourceToken = getDataSourceProviderName(dataSourceName);
      this.logger.log(`register datasource: ${dataSourceToken}`);
      const dataSource = this.moduleRef.get(dataSourceToken, { strict: false });
      addTransactionalDataSource({
        dataSource,
        name: dataSourceToken,
      });
    } catch (e) {
      this.logger.error('onApplicationBootstrap error');
      this.logger.error(e.stack);
    }
  }
}
