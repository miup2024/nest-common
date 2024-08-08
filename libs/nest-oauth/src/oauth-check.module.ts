import { DynamicModule, Module } from '@nestjs/common';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common/interfaces';
import { CheckStrategy } from './strategy/check.strategy';
import { CheckInterceptor } from './common/oauth.interface';


export interface OauthCheckModuleOptions {
  server: string;
  checkPath: string;
  checkMethod?: 'POST' | 'GET';
  interceptor?: CheckInterceptor;
}

export interface OauthCheckModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<OauthCheckModuleOptions> | OauthCheckModuleOptions;
  inject?: any[];
  extraProviders?: [];
}

@Module({})
export class OauthCheckModule {
  public static registerAsync(options: OauthCheckModuleAsyncOptions): DynamicModule {
    const configProviderName = Symbol('OauthCheckModuleAsyncOptions');
    const configProvider: FactoryProvider = {
      provide: configProviderName,
      useFactory: options.useFactory,
      inject: options.inject,
    };
    const checkStrategyProvider = {
      provide: CheckStrategy,
      useFactory: (config: OauthCheckModuleOptions) => {
        return new CheckStrategy(config, config.interceptor);
      },
      inject: [configProviderName],
      imports: options.imports,
    };
    return {
      module: OauthCheckModule,
      imports: [
        ...(options.imports || []),
      ],
      providers: [configProvider, checkStrategyProvider],
    };
  }
}