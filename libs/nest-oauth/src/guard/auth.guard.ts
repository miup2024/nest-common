import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Principle } from '../index';

@Injectable()
export class JwtAuthGuardClass extends AuthGuard('jwt') {
  private readonly scopes: Array<string>;
  private readonly noValidate: boolean = true;

  constructor(noValidate: boolean, ...scopes) {
    super();
    this.scopes = scopes.sort();
    this.noValidate = noValidate;
  }

  handleRequest(err, user, info) {
    if (this.noValidate) {
      if (err) {
        throw err || new UnauthorizedException((info || {}).message);
      }
      return user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException((info || {}).message);
    }
    const principle: Principle = user as Principle;
    this.validateScope(principle);
    return user;
  }

  private validateScope(principle: Principle) {
    if (this.scopes.length === 0) {
      return;
    }
    if (!principle.scopes || principle.scopes.length <= 0) {
      throw new UnauthorizedException(`no scope all`);
    }
    for (const reqScope of this.scopes) {
      if (!principle.scopes.includes(reqScope)) {
        throw new UnauthorizedException(`no scope [${reqScope}]`);
      }
    }
  }
}

export function JwtOAuthGuard(...scopes) {
  return new JwtAuthGuardClass(false, ...scopes);
}

export function JwtOAuthUser() {
  return new JwtAuthGuardClass(true);
}
