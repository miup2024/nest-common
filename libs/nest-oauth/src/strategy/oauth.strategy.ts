import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthorizationCode, AuthorizationCodeParams, FromRequestUtil, OauthServer, OauthToken } from '..';
import { Strategy } from 'passport';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
  private logger = new Logger(OauthStrategy.name);

  constructor(private oauthServer: OauthServer) {
    super();
  }

  authenticate(req: any, options?: any) {
    this._authenticate(req, options).then((res) => {
      // @ts-ignore
      this.success(res);
    }).catch((err) => {
      // @ts-ignore
      this.error(err);
    });
  }

  async _authenticate(req: any, options?: any): Promise<any> {
    this.logger.debug(`start authenticate [${req.oauthType}]`);
    let res = null;
    if (req.oauthType === 'code') {
      res = await this.authenticateCode(req, options);
    } else if (req.oauthType === 'token') {
      res = await this.authenticateToken(req, options);
    } else {
      throw new BadRequestException('oauthType is not support');
    }
    this.logger.debug(`end authenticate [${req.oauthType}]`);
    return res;
  }

  async authenticateToken(req: any, options?: any): Promise<OauthToken> {
    options.property = 'token';
    return this.oauthServer.token(this.buildParams(req), {
      ...options,
      ...req.query,
      ...req.body,
    });
  }

  async authenticateCode(req: any, options?: any): Promise<AuthorizationCode> {
    options.property = 'code';
    return this.oauthServer.authorizationCode(this.buildParams(req), {
      ...options,
      ...req.query,
      ...req.body,
    });
  }

  buildParams(req: any) {
    const grant_type = FromRequestUtil.lookup(req.body, 'grant_type');
    const client_id = FromRequestUtil.lookup(req.body, 'client_id');
    const client_secret = FromRequestUtil.lookup(req.body, 'client_secret');
    const code = FromRequestUtil.lookup(req.body, 'code');
    const redirect_uri = FromRequestUtil.lookup(req.body, 'redirect_uri');
    const scope = FromRequestUtil.lookup(req.body, 'scope');
    const username = FromRequestUtil.lookup(req.body, 'username');
    const password = FromRequestUtil.lookup(req.body, 'password');
    const state = FromRequestUtil.lookup(req.body, 'state');
    const refresh_token = FromRequestUtil.lookup(req.body, 'refresh_token');
    const response_type = FromRequestUtil.lookup(req.body, 'response_type') || 'code';
    const params = {
      grant_type,
      client_id,
      client_secret,
      refresh_token,
      code,
      username,
      password,
      scope,
      state,
      redirect_uri,
      response_type,
    };
    return params;
  }
}
