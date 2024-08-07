import {
  All,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AuthPrinciple,
  JwtTokenGuard, OauthGuard,
  Principle,
} from '@miup/nest-oauth';
import { CheckTokenGuard } from '../libs/nest-oauth/src/guard/check.guard';

@Controller('demo')
export class AppController {
  logger = new Logger(AppController.name);

  constructor() {
    this.logger.debug('----');
    this.logger.log('----');
    this.logger.error('----');
    this.logger.warn('----');
  }

  @Post('authorie')
  @UseGuards(OauthGuard('code'))
  async authorie(@Req() request) {
    this.logger.debug('start authorie');
    return request.code;
  }

  // @Post('authorie')
  // @UseGuards(JwtTokenGuard('code'))
  // async authorie(@Req() request) {
  //   return request.code;
  // }

  @Post('login')
  @UseGuards(OauthGuard('token'))
  async login(@Req() request) {
    return request.token;
  }
  @All('me')
  @UseGuards(CheckTokenGuard())
  async me(@AuthPrinciple() principle: Principle) {
    console.log(principle)
    return principle;
  }
  @All('check')
  @UseGuards(JwtTokenGuard())
  async check(@AuthPrinciple() principle: Principle) {
    return principle;
  }
}
