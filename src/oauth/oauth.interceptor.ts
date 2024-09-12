import { Injectable } from '@nestjs/common';
import { OauthClient, OauthStoreInterface, OauthUser } from '@miup/nest-oauth';

@Injectable()
export class OauthStoreService implements OauthStoreInterface {
  constructor() {
  }

  async getUser(params: { username: string; password: string; }, allParams?: any): Promise<OauthUser> {
    return { userId: 'test_user' };
  }

  async getClient(params: { clientId: string; scopes: string; }, allParams?: any): Promise<OauthClient> {
    return { clientId: 'test_client' };

  }
  async getClientAndValidate(params: {
    clientId: string;
    clientSecret: string;
    scopes: string;
  }, allParams?: any): Promise<OauthClient> {
    return { clientId: 'test_client' };
  }

}
