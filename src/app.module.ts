import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@miup/nest-config';
import { Log4jModule } from '@miup/nest-log4j';
import { OauthStoreService } from './oauth/oauth.store';
import {
  OauthClientModule,
  OauthServerModule,
  OauthServerModuleOptions,
  OauthStoreInterface,
} from '@miup/nest-oauth';
import { LocalOauthModule } from './oauth/local-oauth.module';
import { AliCloudSmsModule } from '@miup/nest-ali-sms';
import { RedisModule } from '@miup/nest-redis';
import { SubModule } from './sub-module/sub.module';
import { SnowFlakeConfig, SnowFlakeModule } from '@miup/nest-snow-flake';

@Module({
  imports: [
    ConfigModule.register({
      env: 'develop',
    }),
    Log4jModule.registerAsync({
      useFactory: (conf: ConfigService) => {
        return {
          pkgName: 'miup-common',
        };
      },
      inject: [ConfigService],
    }),
    OauthServerModule.registerAsync({
      imports: [LocalOauthModule],
      useFactory: (oa: OauthStoreInterface): OauthServerModuleOptions => {
        return {
          oauthStore: oa,
          jwt: {
            secretOrPrivateKey: '123',
            codeExpiresIn: '120s',
            accessTokenExpiresIn: '7d',
            refreshTokenExpiresIn: '30d',
          },
        };
      },
      inject: [OauthStoreService, ConfigService],
    }),
    OauthClientModule.registerAsync({
      useFactory: (conf: ConfigService) => {
        return {
          jwt: {
            secretOrPrivateKey: '123',
          },
        };
      },
      inject: [ConfigService],
    }),
    AliCloudSmsModule.register({
      default: {
        accessKeyId: 'sss',
        secretAccessKey: 'sss',
      },
    }),
    RedisModule.registerAsync({
      useFactory: (conf: ConfigService) => {
        return {
          name: 'default',
          host: '192.168.1.102',
          port: 6379,
          db: 1,
        };
      },
      inject: [ConfigService],
    }),
    SnowFlakeModule.register({
      datacenterId: 1,
      machineId: 1,
    }),
    SubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
