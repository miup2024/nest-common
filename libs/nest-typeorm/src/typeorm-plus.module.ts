import { FactoryProvider, Global, Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '@miup/nest-transaction';
import { TypeOrmLogger } from './logger';
import { DataSource } from 'typeorm';
import { CONFIG_PROVIDER_NAME, TypeOrmPlusModuleAsyncOptions, TypeOrmPlusModuleOptions } from './const';


const metakey = 'entity_type_name';

export function TypeormRepository(type: any): ClassDecorator {
  // return createClassDecorator(metakey, [type]);
  return (target) => {
    Reflect.defineMetadata(metakey, [type], target);
    return target;
  }
}


@Module({})
@Global()
export class TypeormPlusModule {
  public static registerAsync(options: TypeOrmPlusModuleAsyncOptions) {
    const configProvider = {
      provide: CONFIG_PROVIDER_NAME,
      useFactory: options.useFactory,
      inject: options.inject || []
    };

    const entityList = options.repository.map((repository) => {
      const entityClass: any = Reflect.getMetadata(metakey, repository);
      if (entityClass && entityClass.length > 0) return entityClass[0];
    });

    const typeormModule = TypeOrmModule.forRootAsync({
      imports: undefined,
      name: options.datasource,
      useFactory: async (config: TypeOrmPlusModuleOptions) => {
        const conf = {
          ...config
        };
        conf.entities = entityList;
        conf.logger = new TypeOrmLogger(config);
        return conf;
      },
      inject: [CONFIG_PROVIDER_NAME],
      extraProviders: [configProvider]
    });
    //
    const transactionModule = TransactionModule.registerAsync({
      useFactory(config: TypeOrmPlusModuleOptions) {
        const transactionConfig=Object.assign({
          maxHookHandlers: 100,
          storageDriver: 'AUTO'
        }, config.transaction)
        if (options.datasource) {
          transactionConfig.dataSources = [options.datasource];
        }
        return transactionConfig;
      },
      inject: [CONFIG_PROVIDER_NAME],
      imports: [TypeormPlusModule]
    });

    const repositoryProviders: Array<FactoryProvider> = [];

    for (const repository of options.repository) {
      const entityClassList: any = Reflect.getMetadata(metakey, repository);
      if (!entityClassList || entityClassList.length <= 0) {
        continue;
      }
      const entityClass = entityClassList[0];
      let dataSourceToken: any = DataSource;
      if (options.datasource) {
        dataSourceToken = getDataSourceToken(options.datasource);
      }
      repositoryProviders.push({
        provide: repository,
        useFactory(dataSource: DataSource) {
          return new repository(entityClass,dataSource.manager, dataSource.manager.queryRunner);
        },
        inject: [dataSourceToken]
      });
    }

    return {
      module: TypeormPlusModule,
      providers: [configProvider, ...repositoryProviders],
      imports: [...(options.imports || []), typeormModule, transactionModule],
      exports: [configProvider, transactionModule, typeormModule, ...repositoryProviders]
    };
  }
}
