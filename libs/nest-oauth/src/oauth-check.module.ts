import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
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
    const configProvider = {
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
    };
    return {
      module: OauthCheckModule,
      imports: [],
      providers: [configProvider, checkStrategyProvider],
    };
  }
}