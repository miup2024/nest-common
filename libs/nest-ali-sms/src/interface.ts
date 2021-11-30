import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';

export interface AliCloudSmsModuleOptions {
  default: {
    accessKeyId: string;
    secretAccessKey: string;
    smsApiEndpoint?: string;
    baseApiEndpoint?: string;
    regionId?: string;
    mnsVpc?: string;
    signName?: string;
  };
}

export interface AliCloudSmsModuleOptionsFactory {
  createOptions(): Promise<AliCloudSmsModuleOptions> | AliCloudSmsModuleOptions;
}

export interface AliCloudSmsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<AliCloudSmsModuleOptions> | AliCloudSmsModuleOptions;
  inject?: any[];
}

export const ALICLOUD_SMS_MODULE_OPTIONS = Symbol(
  'ALICLOUD_SMS_MODULE_OPTIONS',
);
