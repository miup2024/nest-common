import { DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { SnowFlakeIdGenerator } from './id-generator';
import { ModuleMetadata } from '@nestjs/common/interfaces';

@Module({})
@Global()
export class SnowFlakeModule {

  public static registerSync(config: SnowFlakeSyncConfig): DynamicModule {
    const configProvider: FactoryProvider = {
      provide: 'SnowFlakeConfig',
      useFactory: config.useFactory,
      inject: [...(config.inject || [])],
    };
    return {
      module: SnowFlakeModule,
      providers: [
        configProvider,
        {
          provide: SnowFlakeIdGenerator,
          useFactory: (config: SnowFlakeConfig) => new SnowFlakeIdGenerator(config.datacenterId, config.machineId),
          inject: [configProvider.provide],
        },
      ],
      exports: [
        SnowFlakeIdGenerator,
      ],
    };
  }

  public static register(config: SnowFlakeConfig): DynamicModule {
    const provider = {
      provide: SnowFlakeIdGenerator,
      useValue: new SnowFlakeIdGenerator(config.datacenterId, config.machineId),
    };
    return {
      module: SnowFlakeModule,
      providers: [
        provider,
      ],
      exports: [
        provider.provide,
      ],
    };

  }
}

export interface SnowFlakeConfig {
  datacenterId: number;
  machineId: number;
}


export interface SnowFlakeSyncConfig extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<SnowFlakeConfig> | SnowFlakeConfig;
  inject?: any[];
}