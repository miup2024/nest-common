import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class OauthTokenGuardClass extends AuthGuard('local') {
  type: 'token' | 'code' = null;

  constructor(type: 'token' | 'code') {
    super();
    this.type = type;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    req.oauthType = this.type;
    return super.canActivate(context);
  }

  handleRequest(err, tokenInfo, info) {
    if (err || !tokenInfo) {
      throw err || new UnauthorizedException((info || {}).message);
    }
    return tokenInfo;
  }
}

export function JwtTokenGuard(type: 'token' | 'code') {
  return new OauthTokenGuardClass(type);
}
