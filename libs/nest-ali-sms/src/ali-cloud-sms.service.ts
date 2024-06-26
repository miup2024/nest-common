import { AliCloudSmsModuleOptions } from './interface';
import * as SMSClient from '@alicloud/sms-sdk';

export class AliCloudSmsService {
  private defaultClient: SMSClient;

  constructor(private options: AliCloudSmsModuleOptions) {
    this.defaultClient = new SMSClient(options.default);
  }

  async send(
    tempcode: string,
    tempParams: any,
    mobile: string | Array<string>,
    signName?: string,
  ): Promise<void> {
    const sign = signName || this.options.default.signName;
    const mobiles = mobile instanceof Array ? mobile.join(',') : mobile;
    await this.defaultClient.sendSMS({
      PhoneNumbers: mobiles,
      SignName: sign,
      TemplateCode: tempcode,
      TemplateParam: JSON.stringify(tempParams),
    });
  }
}
