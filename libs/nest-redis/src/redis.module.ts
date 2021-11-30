import {
  DynamicModule,
  FactoryProvider,
  Global,
  Module,
  ValueProvider,
} from '@nestjs/common';
import {
  PROVIDER_REDIS_MODULE_OPTIONS,
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from './redis.interface';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  public static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const configProvider: FactoryProvider = {
      provide: PROVIDER_REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const createClientProvider: FactoryProvider = {
      provide: RedisService,
      useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
        return new RedisService(options);
      },
      inject: [PROVIDER_REDIS_MODULE_OPTIONS],
    };

    return {
      module: RedisModule,
      imports: [...(options.imports || [])],
      providers: [configProvider, createClientProvider],
      exports: [createClientProvider],
    };
  }

  public static register(options: RedisModuleOptions | RedisModuleOptions[]) {
    const configProvider: ValueProvider = {
      useValue: options,
      provide: PROVIDER_REDIS_MODULE_OPTIONS,
    };
    const createClientProvider: FactoryProvider = {
      provide: RedisService,
      useFactory: (options: RedisModuleOptions | RedisModuleOptions[]) => {
        return new RedisService(options);
      },
      inject: [PROVIDER_REDIS_MODULE_OPTIONS],
    };
    return {
      module: RedisModule,
      providers: [configProvider, createClientProvider],
      exports: [createClientProvider],
    };
  }
}
