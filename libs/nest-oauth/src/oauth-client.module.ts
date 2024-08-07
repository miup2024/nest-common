import { DynamicModule, Global, Module } from '@nestjs/common';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common/interfaces';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import * as jwt from 'jsonwebtoken';

export const OAUTH_CLIENT_MODULE_OPTIONS = 'OAUTH_CLIENT_MODULE_OPTIONS';

export interface VerifyJwtOptions {
  secretOrPrivateKey: jwt.Secret;
  publicKey?: string | Buffer;
  verifyOptions?: jwt.VerifyOptions;
}

export interface OauthClientModuleOptions {
  fromRequest?: Array<'body' | 'header' | 'query' | 'cookie'>;
  defaultScopes?: string;
  jwt: VerifyJwtOptions;
}

export interface OauthClientModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<OauthClientModuleOptions> | OauthClientModuleOptions;
  inject?: any[];
  extraProviders?: [];
}

@Global()
@Module({})
export class OauthClientModule {
  public static registerAsync(
    options: OauthClientModuleAsyncOptions,
  ): DynamicModule {
    const configProvider: FactoryProvider = {
      provide: OAUTH_CLIENT_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const jwtStrategyProvider: FactoryProvider = {
      provide: JwtStrategy,
      useFactory: (options: OauthClientModuleOptions) => {
        const fromTypes = new Set(options.fromRequest || []);
        return new JwtStrategy(fromTypes, options.jwt);
      },
      inject: [OAUTH_CLIENT_MODULE_OPTIONS],
    };
    return {
      module: OauthClientModule,
      imports: [
        ...(options.imports || []),
        JwtModule.registerAsync({
          useFactory: (options: OauthClientModuleOptions) => {
            return options.jwt;
          },
          inject: [OAUTH_CLIENT_MODULE_OPTIONS],
        } as JwtModuleAsyncOptions),
      ],
      providers: [jwtStrategyProvider, configProvider],
      exports: [jwtStrategyProvider, configProvider],
    };
  }

}
