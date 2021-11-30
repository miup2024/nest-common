import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@miup/nest-config';
import { AliCloudSmsModule, AliCloudSmsService } from '@miup/nest-ali-sms';
import { DemoService } from './demo.service';

@Module({
  imports: [AliCloudSmsModule],
  providers: [DemoService],
})
export class SubModule {}
