import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './service/config.service';

@Global()
@Module({})
export class ConfigModule {
  public static register(option?: ConfigOption): DynamicModule {
    const exportProviders = [
      {
        provide: ConfigService,
        useValue: new ConfigService(option || {}),
      },
    ];
    return {
      module: ConfigModule,
      providers: exportProviders,
      exports: [ConfigService],
    };
  }
}

export class ConfigOption {
  path?: string;
  encoding?: string = 'utf-8';
  basename?: string = 'environment';
  env?: string;
  default?: string = 'default';
}

export * from './service/config.service';
