import { All, Controller, Logger, Post, Req, Res,  UseGuards } from '@nestjs/common';
import { AuthPrinciple, JwtTokenGuard, OauthGuard, Principle, CheckTokenGuard } from '@miup/nest-oauth';
import { Response } from 'express';

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

  @Post('login')
  @UseGuards(OauthGuard('token'))
  async login(@Req() request) {
    return request.token;
  }

  @All('me')
  @UseGuards(CheckTokenGuard())
  async me(@AuthPrinciple() principle: Principle, @Res() res: Response) {
    res.status(200).contentType('application/json').send(principle)
  }

  @All('check')
  @UseGuards(JwtTokenGuard())
  async check(@AuthPrinciple() principle: Principle) {
    return principle;
  }
}
