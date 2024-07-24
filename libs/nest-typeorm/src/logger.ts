import { QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import { format, SqlLanguage } from 'sql-formatter';
import { TypeOrmPlusModuleOptions } from './const';

export class TypeOrmLogger {
  private _log = new Logger(TypeOrmLogger.name);
  private language: SqlLanguage = 'mysql';

  constructor(private config: TypeOrmPlusModuleOptions) {
    this.language = config.type as SqlLanguage;
  }


  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this._log.log(
      '\n' +
      format(query, {
        language: this.language,
        params: parameters ? parameters.map((s) => `'${s}'`) : []
      })
    );
    if (parameters) this._log.log(parameters.join(' '));
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this._log.log(
      '\n' +
      format(query, {
        language: this.language,
        params: parameters ? parameters.map((s) => `'${s}'`) : []
      })
    );
    if (parameters) this._log.log(parameters.join(' '));
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this._log.log(
      '\n' +
      format(query, {
        language: this.language,
        params: parameters ? parameters.map((s) => `'${s}'`) : []
      })
    );
    if (parameters) this._log.log(parameters.join(' '));
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this._log.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this._log.log(message);
  }

  log(level: 'warn' | 'info' | 'log', message: any, queryRunner?: QueryRunner) {
    this._log.log('------------------------------------------');
    this._log.log(level, message);
  }
}
