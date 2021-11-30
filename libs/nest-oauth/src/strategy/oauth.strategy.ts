import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OauthServer, FromRequestUtil, AuthorizationCodeParams } from '..';
import { Strategy } from 'passport';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private oauthServer: OauthServer) {
    super();
  }

  authenticate(req: any, options?: any): any {
    if (req.oauthType === 'code') {
      return this.authenticateCode(req, options);
    } else {
      return this.authenticateToken(req, options);
    }
  }

  authenticateToken(req: any, options?: any): any {
    options.property = 'token';
    const grant_type = FromRequestUtil.lookup(req.body, 'grant_type');
    const client_id = FromRequestUtil.lookup(req.body, 'client_id');
    const client_secret = FromRequestUtil.lookup(req.body, 'client_secret');
    const code = FromRequestUtil.lookup(req.body, 'code');
    const redirect_uri = FromRequestUtil.lookup(req.body, 'redirect_uri');
    const scope = FromRequestUtil.lookup(req.body, 'scope');
    const username = FromRequestUtil.lookup(req.body, 'username');
    const password = FromRequestUtil.lookup(req.body, 'password');
    const state = FromRequestUtil.lookup(req.body, 'password');
    const refresh_token = FromRequestUtil.lookup(req.body, 'refresh_token');
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
    };
    this.oauthServer
      .token(params, req.body)
      .then(res => {
        this.success(res, res);
      })
      .catch(e => {
        this.error(e);
      });
  }

  authenticateCode(req: any, options?: any): any {
    options.property = 'code';
    const params: AuthorizationCodeParams = {
      client_id: FromRequestUtil.lookup(req.body, 'client_id'),
      username: FromRequestUtil.lookup(req.body, 'username'),
      password: FromRequestUtil.lookup(req.body, 'password'),
      response_type:
        FromRequestUtil.lookup(req.body, 'response_type') || 'code',
      redirect_uri: FromRequestUtil.lookup(req.body, 'redirect_uri'),
      scope: FromRequestUtil.lookup(req.body, 'scope'),
      state: FromRequestUtil.lookup(req.body, 'state'),
    };
    this.oauthServer
      .authorizationCode(params, req.body)
      .then(res => {
        this.success(res, res);
      })
      .catch(e => {
        this.error(e);
      });
  }
}
