import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Principle } from '@miup/nest-oauth';

export class CheckTokenGuardClass extends AuthGuard('check') {
  private readonly logger = new Logger(CheckTokenGuardClass.name);
  private readonly scopes: Array<string>;
  private readonly noValidate: boolean = true;

  constructor(noValidate: boolean, ...scopes: string[]) {
    super();
    this.scopes = scopes.sort();
    this.noValidate = noValidate;
  }

  handleRequest(err, user, info) {
    this.logger.debug('start handleRequest')
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
      throw new UnauthorizedException(`no scope`);
    }
    for (const reqScope of this.scopes) {
      if (!principle.scopes.includes(reqScope)) {
        throw new UnauthorizedException(`no scope [${reqScope}]`);
      }
    }
  }
}

export function CheckTokenGuard(...scopes: string[]) {
  return new CheckTokenGuardClass(false, ...scopes);
}

export function CheckTokenUser() {
  return new CheckTokenGuardClass(true);
}