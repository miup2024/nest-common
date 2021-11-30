import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import {
  ALICLOUD_SMS_MODULE_OPTIONS,
  AliCloudSmsModuleAsyncOptions,
  AliCloudSmsModuleOptions,
} from './interface';
import { FactoryProvider } from '@nestjs/common/interfaces';
import { AliCloudSmsService } from './ali-cloud-sms.service';

@Global()
@Module({})
export class AliCloudSmsModule {
  public static register(options: AliCloudSmsModuleOptions) {
    const configProvider: ValueProvider = {
      useValue: options || {},
      provide: ALICLOUD_SMS_MODULE_OPTIONS,
    };

    const smsServiceProvider: FactoryProvider = {
      provide: AliCloudSmsService,
      useFactory: (options: AliCloudSmsModuleOptions) => {
        return new AliCloudSmsService(options);
      },
      inject: [ALICLOUD_SMS_MODULE_OPTIONS],
    };

    return {
      module: AliCloudSmsModule,
      providers: [configProvider, smsServiceProvider],
      exports: [smsServiceProvider],
    };
  }

  public static registerAsync(
    options: AliCloudSmsModuleAsyncOptions,
  ): DynamicModule {
    const configProvider: FactoryProvider = {
      useFactory: options.useFactory,
      provide: ALICLOUD_SMS_MODULE_OPTIONS,
      inject: options.inject || [],
    };
    const smsServiceProvider: FactoryProvider = {
      provide: AliCloudSmsService,
      useFactory: (options: AliCloudSmsModuleOptions) => {
        return new AliCloudSmsService(options);
      },
      inject: [ALICLOUD_SMS_MODULE_OPTIONS],
    };
    return {
      module: AliCloudSmsModule,
      imports: [...(options.imports || [])],
      providers: [configProvider, smsServiceProvider],
      exports: [smsServiceProvider],
    };
  }
}
