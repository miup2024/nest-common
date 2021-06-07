import { ModuleMetadata } from "@nestjs/common/interfaces";
import { RedisOptions } from "ioredis";


export interface RedisModuleOptions extends RedisOptions {
  name: string,
  host: string,
  port: number,
  db?: number,
  password?: string,
  keyPrefix?: string
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory?: (...args: any[]) => RedisModuleOptions | RedisModuleOptions[] | Promise<RedisModuleOptions> | Promise<RedisModuleOptions[]>,
  inject?: any[];
}

export const PROVIDER_REDIS_MODULE_OPTIONS = Symbol("REDIS_MODULE_OPTIONS");
