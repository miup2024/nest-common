import { OauthClient, OauthUser } from './entity';

export interface Principle {
  userId: string;
  client: OauthClient;
  userInfo: OauthUser;
  loginTime: Date;
  scopes?: Array<string>;
}
