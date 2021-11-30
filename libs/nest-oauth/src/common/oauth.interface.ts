import {
  AuthorizationCode,
  CodeData,
  OauthClient,
  OauthToken,
  OauthType,
  OauthUser,
  TokenData,
} from '..';

export interface TokenStoreInterface {
  buildAndStoreToken(
    client: OauthClient,
    user: OauthUser,
    scopes: string,
    allParams: any,
  ): Promise<OauthToken>;

  getRefreshTokenData(
    refresh_token: string,
    allParams: any,
  ): Promise<TokenData>;

  buildAndSaveCode(
    user: OauthUser,
    client: OauthClient,
    scope: string,
    allParams: any,
  ): Promise<string>;

  getCodeData(code: string, allParams: any): Promise<CodeData>;
}

export interface OauthStoreInterface {
  getUser(
    username: string,
    password: string,
    allParams: any,
  ): Promise<OauthUser>;

  getClient(
    client_id: string,
    scope: string,
    allParams?: any,
  ): Promise<OauthClient>;

  getClientAndValidate(
    client_id: string,
    client_secret: string,
    scope: string,
    allParams?: any,
  ): Promise<OauthClient>;
}

export interface OauthInterface {
  authorizationCode(
    params: AuthorizationCodeParams,
    allParams?: any,
  ): Promise<AuthorizationCode>;

  token(
    params: OauthCodeTokenParams | PasswordTokenParams | RefreshTokenParams,
    allParams?: any,
  ): Promise<OauthToken>;
}

export interface AuthorizationCodeParams {
  client_id: string;
  username: string;
  password: string;
  response_type: 'code';
  redirect_uri?: string;
  scope?: string;
  state?: string;

  [properName: string]: any;
}

export interface TokenParams {
  client_id: string;
  client_secret: string;
  grant_type: OauthType;
  state?: string;
}

export interface OauthCodeTokenParams extends TokenParams {
  code: string;

  [properName: string]: any;
}

export interface PasswordTokenParams extends TokenParams {
  username: string;
  password: string;
  scope?: string;

  [properName: string]: any;
}

export interface RefreshTokenParams extends TokenParams {
  refresh_token: string;

  [properName: string]: any;
}
