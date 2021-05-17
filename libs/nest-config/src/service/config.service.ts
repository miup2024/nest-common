import * as dotenv from 'dotenv-extended';
import { ConfigOption } from '../index';
import * as path from 'path';
import { IDotenvExtendedOptions } from 'dotenv-extended';
import { Logger } from '@nestjs/common';

export class ConfigService {

  private logger = new Logger(ConfigService.name);

  private readonly envConfig: { [key: string]: string };

  constructor(option: ConfigOption) {
    const defaultOption = {
      path: path.join(process.cwd(), 'env'),
      encoding: 'utf-8',
      basename: 'environment',
      default: 'default',
      env: process.env.NODE_ENV,
    };
    option = Object.assign(defaultOption, option);
    const dotenvOp: IDotenvExtendedOptions = {
      encoding: option.encoding,
      silent: true,
      defaults: path.join(option.path, `${option.basename}.${option.default}.env`),
      errorOnMissing: false,
      errorOnExtra: false,
      includeProcessEnv: false,
      assignToProcessEnv: true,
      overrideProcessEnv: false,
    };
    if (option.env) {
      dotenvOp.path = path.join(option.path, `${option.basename}.${option.env}.env`);
    }
    this.envConfig = dotenv.load(dotenvOp);
  }

  get<T = any>(key: string, defaultValue?: T): T | undefined {
    const v = this.envConfig[key];
    if (v) {
      return (v as unknown) as T;
    } else {
      return defaultValue;
    }
  }

  getString(key: string, defaultValue?: string): string {
    return this.get<string>(key, defaultValue);
  }

  getNumber(key: string, defaultValue: number): number {
    const v = this.envConfig[key];
    if (v) {
      return parseFloat(v);
    } else {
      return defaultValue;
    }
  }

  getBoolean(key: string, defaultValue: boolean): boolean {
    const v = this.envConfig[key];
    if (v) {
      return v.toUpperCase() === 'TRUE';
    } else {
      return defaultValue;
    }
  }
}

