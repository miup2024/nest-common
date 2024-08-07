import { ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class OauthTokenGuardClass extends AuthGuard('oauth') {
  private readonly type: 'token' | 'code' = null;
  private readonly logger=new Logger(OauthTokenGuardClass.name)

  constructor(type: 'token' | 'code') {
    super();
    this.type = type;
  }

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const req = context.switchToHttp().getRequest();
    req.oauthType = this.type;
    this.logger.debug(`start ${this.type} token guard`);
    const can=await (super.canActivate(context) as Promise<boolean>);
    if(can){
      this.logger.debug(`${this.type} token guard success`);
    }else {
      this.logger.debug(`${this.type} token guard fail`);
    }
    return can;
  }

  handleRequest(err, tokenInfo, info) {
    this.logger.debug(`handleRequest ${this.type}`)
    if (err || !tokenInfo) {
      throw err || new UnauthorizedException((info || {}).message);
    }
    return tokenInfo;
  }
}

export function OauthGuard(type: 'token' | 'code') {
  return new OauthTokenGuardClass(type);
}
