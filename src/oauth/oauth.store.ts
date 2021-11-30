import { Injectable } from '@nestjs/common';
import { OauthClient, OauthStoreInterface } from '@miup/nest-oauth';

@Injectable()
export class OauthStoreService implements OauthStoreInterface {
  constructor() {}

  async getClient(
    client_id: string,
    scope: string,
    allParams?: any,
  ): Promise<OauthClient> {
    return { clientId: 'test_client' };
  }

  async getClientAndValidate(
    client_id: string,
    client_secret: string,
    scope: string,
    allParams?: any,
  ): Promise<OauthClient> {
    return { clientId: 'test_client' };
  }

  async getUser(username: string, password: string, allParams: any) {
    return { userId: 'test_user' };
  }
}
