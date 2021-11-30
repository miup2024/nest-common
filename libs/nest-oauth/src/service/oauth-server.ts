import {
  BadRequestException,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import {
  OauthType,
  CodeData,
  TokenData,
  AuthorizationCodeParams,
  OauthCodeTokenParams,
  OauthInterface,
  OauthStoreInterface,
  PasswordTokenParams,
  RefreshTokenParams,
  TokenStoreInterface,
  OauthClient,
  OauthToken,
  OauthUser,
  AuthorizationCode,
} from '..';

export class OauthServer implements OauthInterface {
  private oauthStore: OauthStoreInterface;
  private tokenStore: TokenStoreInterface;

  private logger: LoggerService = new Logger(OauthServer.name);

  constructor(
    oauthStore: OauthStoreInterface,
    tokenStore: TokenStoreInterface,
  ) {
    this.oauthStore = oauthStore;
    this.tokenStore = tokenStore;
  }

  async authorizationCode(
    params: AuthorizationCodeParams,
    allParams?: any,
  ): Promise<AuthorizationCode> {
    this.logger.debug('start authorizationCode');
    const client: OauthClient = await this.oauthStore.getClient(
      params.client_id,
      params.scope,
      allParams,
    );
    if (!client) {
      throw new UnauthorizedException('client invalidate');
    }
    const user: OauthUser = await this.oauthStore.getUser(
      params.username,
      params.password,
      allParams,
    );
    if (!user) {
      throw new UnauthorizedException('user invalidate');
    }
    const codeStr: string = await this.tokenStore.buildAndSaveCode(
      user,
      client,
      params.scope,
      allParams,
    );
    this.logger.debug('end authorizationCode');
    return {
      code: codeStr,
      clientId: client.clientId,
      redirect_uri: params.redirect_uri,
      state: params.state,
    };
  }

  async token(
    params: OauthCodeTokenParams | PasswordTokenParams | RefreshTokenParams,
    allParams?: any,
  ): Promise<OauthToken> {
    switch (params.grant_type) {
      case OauthType.AuthorizationCode:
        return await this._AuthorizationCodeToken(
          params as OauthCodeTokenParams,
          allParams,
        );
        break;
      case OauthType.Password:
        return await this._PasswordToken(
          params as PasswordTokenParams,
          allParams,
        );
        break;
      case OauthType.RefreshToken:
        return await this._RefreshToken(
          params as RefreshTokenParams,
          allParams,
        );
        break;
      default:
        throw new BadRequestException('grant_type not support');
        break;
    }
  }

  private async _AuthorizationCodeToken(
    params: OauthCodeTokenParams,
    allParams?: any,
  ): Promise<OauthToken> {
    this.logger.debug('start AuthorizationCodeToken');
    const codeData: CodeData = await this.tokenStore.getCodeData(
      params.code,
      allParams,
    );
    const client: OauthClient = await this.oauthStore.getClientAndValidate(
      codeData.client.clientId,
      params.client_secret,
      codeData.scope,
      allParams,
    );
    if (!client) {
      throw new UnauthorizedException('client invalidate');
    }
    const user: OauthUser = codeData.user;
    return await this.tokenStore.buildAndStoreToken(
      client,
      user,
      codeData.scope,
      allParams,
    );
  }

  private async _PasswordToken(
    params: PasswordTokenParams,
    allParams?: any,
  ): Promise<OauthToken> {
    this.logger.debug('start PasswordToken');
    const client: OauthClient = await this.oauthStore.getClientAndValidate(
      params.client_id,
      params.client_secret,
      params.scope,
      allParams,
    );
    if (!client) {
      throw new UnauthorizedException('client invalidate');
    }
    const user: OauthUser = await this.oauthStore.getUser(
      params.username,
      params.password,
      allParams,
    );
    if (!user) {
      throw new UnauthorizedException('user invalidate');
    }
    return await this.tokenStore.buildAndStoreToken(
      client,
      user,
      params.scope,
      allParams,
    );
  }

  private async _RefreshToken(
    params: RefreshTokenParams,
    allParams?: any,
  ): Promise<OauthToken> {
    this.logger.debug('start RefreshToken');
    const refreshTokenData: TokenData = await this.tokenStore.getRefreshTokenData(
      params.refresh_token,
      allParams,
    );
    return await this.tokenStore.buildAndStoreToken(
      refreshTokenData.client,
      refreshTokenData.user,
      refreshTokenData.scope,
      allParams,
    );
  }
}
