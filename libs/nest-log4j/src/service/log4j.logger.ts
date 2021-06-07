import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import * as Log4js from 'log4js';
import { Configuration } from 'log4js';
import * as Path from 'path';
import { Log4jOptions, PROVIDER_LOG4J_MODULE_OPTION } from '../index';
import * as clc from 'cli-color';
import { isObject } from '@nestjs/common/utils/shared.utils';

const yellow = clc.xterm(3);

@Injectable()
export class Log4j implements LoggerService {
  private logInstanceDebug: Log4js.Logger;
  private logInstanceInfo: Log4js.Logger;
  private logInstanceWarning: Log4js.Logger;
  private logInstanceError: Log4js.Logger;
  private logInstanceVerbose: Log4js.Logger;

  constructor(@Inject(PROVIDER_LOG4J_MODULE_OPTION) options: Log4jOptions) {
    const defaultConfig: Configuration = {
      appenders: {
        stdout: { type: 'stdout' },
        all: {
          type: 'dateFile',
          pattern: '.yyyy-MM-dd',
          filename: Path.join(options.baseDir, options.pkgName, 'all.log'),
        },
        debug: {
          type: 'dateFile',
          pattern: '.yyyy-MM-dd',
          filename: Path.join(options.baseDir, options.pkgName, 'debug.log'),
        },
        error: {
          type: 'dateFile',
          pattern: '.yyyy-MM-dd',
          filename: Path.join(options.baseDir, options.pkgName, 'error.log'),
        },
        info: {
          type: 'dateFile',
          pattern: '.yyyy-MM-dd',
          filename: Path.join(options.baseDir, options.pkgName, 'info.log'),
        },
        warning: {
          type: 'dateFile',
          pattern: '.yyyy-MM-dd',
          filename: Path.join(options.baseDir, options.pkgName, 'warning.log'),
        },
      },
      categories: {
        default: { appenders: ['stdout', 'debug'], level: 'debug' },
        debug: { appenders: ['stdout', 'debug'], level: 'debug' },
        error: { appenders: ['stdout', 'error'], level: 'error' },
        info: { appenders: ['stdout', 'info'], level: 'info' },
        warning: { appenders: ['stdout', 'warning'], level: 'warn' },
        all: { appenders: ['stdout', 'warning'], level: 'warn' },
      },
      pm2: options.pm2,
      pm2InstanceVar: options.pm2InstanceVar,
      levels: options.levels,
      disableClustering: options.disableClustering,
    };
    Log4js.configure(defaultConfig);
    this.logInstanceDebug = Log4js.getLogger('debug');
    this.logInstanceInfo = Log4js.getLogger('info');
    this.logInstanceWarning = Log4js.getLogger('warning');
    this.logInstanceError = Log4js.getLogger('error');
    this.logInstanceVerbose = Log4js.getLogger('all');
    this.overwriteContextLogger()
  }

  error(message: any, trace?: string, context?: string): any {
    this.logInstanceError.error(this.printMessage(message, clc.red, context));
    this.logInstanceVerbose.error(this.printMessage(message, clc.red, context));
    if (trace) {
      this.logInstanceError.error(trace);
      this.logInstanceVerbose.error(trace);
    }
  }

  warn(message: any, context?: string): any {
    this.logInstanceWarning.warn(this.printMessage(message, clc.yellow, context));
    this.logInstanceVerbose.warn(this.printMessage(message, clc.yellow, context));
  }

  log(message: any, context?: string): any {
    this.logInstanceInfo.info(this.printMessage(message, clc.green, context));
    this.logInstanceVerbose.info(this.printMessage(message, clc.green, context));
  }

  debug(message: any, context?: string) {
    this.logInstanceDebug.debug(this.printMessage(message, clc.magentaBright, context));
    this.logInstanceVerbose.debug(this.printMessage(message, clc.magentaBright, context));
  }

  verbose(message: any, context?: string): any {
    this.debug(message, context);
  }


  private printMessage(
    message: any,
    color: (message: string) => string,
    context = '',
  ): string {
    const output = isObject(message)
      ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
      : color(message);

    const pidMessage = color(`${process.pid}   - `);
    const contextMessage = context ? yellow(`[${context}] `) : '';
    return `${pidMessage}  ${contextMessage}${output}`;
  };


  private overwriteContextLogger() {
    Logger.overrideLogger(this);
  }
}
