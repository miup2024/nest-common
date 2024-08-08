import { Strategy } from 'passport';
import { PassportStrategy } from '@nestjs/passport';
import { CheckInterceptor, OauthCheckModuleOptions, Principle } from '..';
import { Logger, LoggerService, UnauthorizedException } from '@nestjs/common';
import * as http from 'http';
import { RequestOptions } from 'http';

export class CheckStrategy extends PassportStrategy(Strategy, 'check') {
  private logger: LoggerService = new Logger(CheckStrategy.name);


  constructor(
    private config: OauthCheckModuleOptions,
    private interceptor: CheckInterceptor ) {
    super();
  }

  authenticate(req: any, options?: any) {
    this._authenticate(req, options).then((res) => {
      // @ts-ignore
      this.success(res);
    }).catch((err) => {
      const e = new UnauthorizedException(err.message);
      // @ts-ignore
      this.error(e);
    });
  }

  async _authenticate(req: Request, options?: any) {
    if (this.interceptor)
      await this.interceptor.preCheck(req, options);
    let princpile: Principle = await this.doHttpGet(req);
    if (this.interceptor)
      princpile = await this.interceptor.postCheck(princpile, req, options);
    return princpile;

  }


  async doHttpGet(req: Request) {
    const url = new URL(this.config.server + this.config.checkPath);
    const res: string = await this.get({
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      protocol: url.protocol,
      method: this.config.checkMethod,
      headers: {
        ...req.headers as any,
      },
    });
    return JSON.parse(res);
  }

  async get(config: RequestOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const req = http.request(config, (res) => {
        if (res.statusCode !== 200) {
          reject(new UnauthorizedException(res.statusMessage));
          return;
        }
        let msg = '';
        res.on('data', (data) => {
          msg += data;
        });
        res.on('end', () => {
          resolve(msg);
        });
        res.on('error', (e) => {
          reject(e);
        });
        res.resume();
      });
      req.end();
    });
  }

}