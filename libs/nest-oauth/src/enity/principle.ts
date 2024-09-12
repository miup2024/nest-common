import { OauthClient, OauthUser } from './entity';

export type Principle = {
  userId: string;
  clientId: string;
  scopes?: Array<string>;
}
