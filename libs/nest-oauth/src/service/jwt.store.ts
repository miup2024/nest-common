import {
  CodeData,
  OauthClient,
  OauthToken,
  OauthUser,
  Principle,
  SignJwtOptions,
  TokenData,
  TokenStoreInterface,
} from '..';
import * as jwt from 'jsonwebtoken';
import * as ms from 'ms';

const defaultTokenOptionExpiresIn = '1h';

const defaultCodeOptionExpireIn = '120s';

const defaultRefreshOptionExpiresIn = '7d';

export class JwtStore implements TokenStoreInterface {
  private optionsCode: SignJwtOptions;
  private optionsToken: SignJwtOptions;
  private optionsRefresh: SignJwtOptions;
  private vOptions: jwt.VerifyOptions = {};

  constructor(options: SignJwtOptions) {
    this.optionsCode = Object.assign({}, options, { signOptions: {} });
    this.optionsRefresh = Object.assign({}, options, { signOptions: {} });
    this.optionsToken = Object.assign({}, options, { signOptions: {} });

    this.optionsCode.signOptions.expiresIn =
      this.optionsCode.codeExpiresIn || defaultCodeOptionExpireIn;
    this.optionsRefresh.signOptions.expiresIn =
      this.optionsCode.refreshTokenExpiresIn || defaultRefreshOptionExpiresIn;
    this.optionsToken.signOptions.expiresIn =
      this.optionsCode.accessTokenExpiresIn || defaultTokenOptionExpiresIn;

    if (this.optionsToken.signOptions.algorithm) {
      this.vOptions.algorithms = [this.optionsToken.signOptions.algorithm];
    }
    if (this.optionsToken.signOptions.audience) {
      this.vOptions.audience = this.optionsToken.signOptions.audience;
    }
    if (this.optionsToken.signOptions.subject) {
      this.vOptions.subject = this.optionsToken.signOptions.subject;
    }
    if (this.optionsToken.signOptions.jwtid) {
      this.vOptions.jwtid = this.optionsToken.signOptions.jwtid;
    }
    if (this.optionsToken.signOptions.issuer) {
      this.vOptions.issuer = this.optionsToken.signOptions.issuer;
    }
  }

  buildAndSaveCode(
    user: OauthUser,
    client: OauthClient,
    scope: string,
    allParams: any,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const codeDate: CodeData = {
          user: user,
          client: client,
          scope: scope || '',
          signTime: new Date(),
        };
        const code = jwt.sign(
          codeDate,
          this.optionsCode.secretOrPrivateKey || '',
          this.optionsCode.signOptions,
        );
        resolve(code);
      } catch (e) {
        reject(e);
      }
    });
  }

  buildAndStoreToken(
    client: OauthClient,
    user: OauthUser,
    scopes: string,
    allParams: any,
  ): Promise<OauthToken> {
    return new Promise((resolve, reject) => {
      try {
        const principle: Principle = {
          userId: user.userId,
          userInfo: user,
          client: client,
          loginTime: new Date(),
          scopes: scopes ? scopes.split(',') : [],
        };
        principle.scopes.sort();
        const tokenData: TokenData = {
          user: user,
          client: client,
          scope: scopes,
          signTime: new Date(),
        };
        const access_token = jwt.sign(
          principle,
          this.optionsToken.secretOrPrivateKey || '',
          this.optionsToken.signOptions,
        );
        const refresh_token = jwt.sign(
          tokenData,
          this.optionsRefresh.secretOrPrivateKey || '',
          this.optionsRefresh.signOptions,
        );
        let expires_in: any = this.optionsToken.signOptions.expiresIn;
        if (isNaN(expires_in)) {
          expires_in = ms(expires_in);
        }
        resolve({
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in,
          token_type: 'Bearer',
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  getCodeData(code: string, allParams: any): Promise<CodeData> {
    return new Promise((resolve, reject) => {
      try {
        const data: CodeData = jwt.verify(
          code,
          this.optionsCode.publicKey ||
          (this.optionsCode.secretOrPrivateKey as any),
          this.vOptions,
        ) as CodeData;
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  getRefreshTokenData(
    refresh_token: string,
    allParams: any,
  ): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      try {
        const data: TokenData = jwt.verify(
          refresh_token,
          this.optionsRefresh.publicKey ||
          (this.optionsRefresh.secretOrPrivateKey as any),
          this.vOptions,
        ) as TokenData;
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }
}
