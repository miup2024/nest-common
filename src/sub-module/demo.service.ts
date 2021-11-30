import { Injectable } from '@nestjs/common';
import { AliCloudSmsService } from '@miup/nest-ali-sms';

@Injectable()
export class DemoService {
  constructor(private sms: AliCloudSmsService) {}
}
