import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { FactoryProvider, ModuleMetadata } from '@nestjs/common/interfaces';
import { JwtStore, OauthServer, OauthStoreInterface, TokenStoreInterface } from '.';
import * as jwt from 'jsonwebtoken';
import { OauthStrategy } from './strategy/oauth.strategy';
import { PassportModule } from '@nestjs/passport';

export const OAUTH_SERVER_MODULE_OPTIONS = 'OAUTH_SERVER_MODULE_OPTIONS';

export interface SignJwtOptions {
  secretOrPrivateKey?: jwt.Secret;
  publicKey?: string | Buffer;
  signOptions?: jwt.SignOptions;
  codeExpiresIn?: number | string;
  accessTokenExpiresIn?: number | string;
  refreshTokenExpiresIn?: number | string;
}

export interface OauthServerModuleOptions {
  oauthStore?: OauthStoreInterface;
  tokenStore?: TokenStoreInterface;
  jwt?: SignJwtOptions;
}

export interface OauthServerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<OauthServerModuleOptions> | OauthServerModuleOptions;
  inject?: any[];
}

@Global()
@Module({})
export class OauthServerModule {
  public static registerAsync(
    options: OauthServerModuleAsyncOptions,
  ): DynamicModule {
    const configProvider: FactoryProvider = {
      provide: OAUTH_SERVER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const oauthServiceProvider: FactoryProvider = {
      provide: OauthServer,
      useFactory: (
        option: OauthServerModuleOptions,
        tokenStore: TokenStoreInterface,
      ) => {
        return new OauthServer(option.oauthStore, option.tokenStore || tokenStore);
      },
      inject: [OAUTH_SERVER_MODULE_OPTIONS, JwtStore],
    };

    const tokenStoreProvider: FactoryProvider = {
      provide: JwtStore,
      useFactory: (options: OauthServerModuleOptions) => {
        return new JwtStore(options.jwt||{});
      },
      inject: [OAUTH_SERVER_MODULE_OPTIONS],
    };

    const tokenStrategyProvider: FactoryProvider = {
      provide: OauthStrategy,
      useFactory: (oauthServer: OauthServer) => {
        return new OauthStrategy(oauthServer);
      },
      inject: [OauthServer],
    };

    return {
      module: OauthServerModule,
      imports: [PassportModule.register({}), ...(options.imports || [])],
      providers: [
        configProvider,
        oauthServiceProvider,
        tokenStoreProvider,
        tokenStrategyProvider,
      ],
      exports: [oauthServiceProvider],
    };
  }

}
