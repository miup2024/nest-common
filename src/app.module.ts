import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthStoreService } from './oauth/oauth.store';
import {
  OauthCheckModule,
  OauthClientModule,
  OauthServerModule,
  OauthServerModuleOptions,
  OauthStoreInterface,
} from '@miup/nest-oauth';
import { LocalOauthModule } from './oauth/local-oauth.module';

@Module({
  imports: [
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
      inject: [OauthStoreService],
    }),
    OauthClientModule.registerAsync({
      useFactory: () => {
        return {
          jwt: {
            secretOrPrivateKey: '123',
          },
        };
      },
      inject: [],
    }),
    OauthCheckModule.registerAsync({
      useFactory: () => {
        return {
          server: 'http://localhost:8088',
          checkPath: '/demo/check',
          checkMethod: 'GET',
        };
      },
      inject: [],
    }),
    // // AliCloudSmsModule.register({
    // //   default: {
    // //     accessKeyId: 'sss',
    // //     secretAccessKey: 'sss',
    // //   },
    // // }),
    // // RedisModule.registerAsync({
    // //   useFactory: (conf: ConfigService) => {
    // //     return {
    // //       name: 'default',
    // //       host: '192.168.1.102',
    // //       port: 6379,
    // //       db: 1,
    // //     };
    // //   },
    // //   inject: [ConfigService],
    // // }),
    // // SnowFlakeModule.register({
    // //   datacenterId: 1,
    // //   machineId: 1,
    // // }),
    // SubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
