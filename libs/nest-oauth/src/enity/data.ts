import { OauthClient, OauthUser } from './entity';

export interface CodeData {
  client: OauthClient;
  user: OauthUser;
  scope: string;
  signTime: Date;
}

export interface TokenData {
  client: OauthClient;
  user: OauthUser;
  scope: string;
  signTime: Date;
}
