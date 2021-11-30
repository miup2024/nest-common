import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Principle, VerifyJwtOptions, FromRequestUtil } from '..';
import { Logger, LoggerService } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger: LoggerService = new Logger(JwtStrategy.name);

  constructor(
    fromRequest: Set<'body' | 'header' | 'query' | 'cookie'>,
    private jwtOption: VerifyJwtOptions,
  ) {
    super({
      jwtFromRequest: FromRequestUtil.buid(fromRequest),
      secretOrKey: jwtOption.secretOrPrivateKey,
      jsonWebTokenOptions: jwtOption.verifyOptions,
    });
  }

  async validate(payload: Principle) {
    return payload;
  }
}
