import { OauthClient, OauthUser } from './entity';

export type Principle = {
  userId: string;
  client: OauthClient;
  userInfo: OauthUser;
  loginTime: Date;
  scopes?: Array<string>;
}
