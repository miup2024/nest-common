export interface OauthClient {
  clientId: string;

  [propertyName: string]: any;
}

export interface OauthToken {
  access_token: string;
  refresh_token: string;
  expires_in: any;

  [propertyName: string]: any;
}

export interface OauthUser {
  userId: string;

  [propertyName: string]: any;
}

export interface AuthorizationCode {
  clientId: string;
  redirect_uri: string;
  code: string;
  state?: string;

  [propertyName: string]: any;
}
