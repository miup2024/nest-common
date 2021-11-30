import { Module } from '@nestjs/common';
import { OauthStoreService } from './oauth.store';

@Module({
  imports: [],
  providers: [OauthStoreService],
  exports: [OauthStoreService],
})
export class LocalOauthModule {}
