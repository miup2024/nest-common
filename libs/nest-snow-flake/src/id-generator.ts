import { Logger } from '@nestjs/common';

export class SnowFlakeIdGenerator {
  private static EPOCH: number = Date.parse('2020-01-01'); // 自定义起始时间，这里以2020年1月1日为例
  private readonly datacenterId: number; // 数据中心ID
  private readonly machineId: number; // 机器ID
  private sequence: number = 0; // 序列号
  private lastTimestamp: number = 0; // 上次生成ID的时间戳
  private readonly log: Logger = new Logger(SnowFlakeIdGenerator.name);

  constructor(datacenterId: number = 0, machineId: number = 0) {
    this.log.log(`create id generator by datacenterId: ${datacenterId}, machineId: ${machineId}`);
    if (datacenterId > 31 || machineId > 31) {
      throw new Error('Datacenter ID and Machine ID must be between 0 and 31.');
    }
    this.datacenterId = datacenterId;
    this.machineId = machineId;
  }

  async generateIdNumber(): Promise<bigint> {
    this.log.log(`generateId`);

    let timestamp = BigInt(Date.now());
    if (timestamp <= BigInt(this.lastTimestamp)) { // 防止时钟回拨
      timestamp = BigInt(this.lastTimestamp) + 1n;
    }
    this.lastTimestamp = Number(timestamp);

    const id = ((timestamp - BigInt(SnowFlakeIdGenerator.EPOCH)) << 22n) // 时间戳部分
      | (BigInt(this.datacenterId) << 17n)           // 数据中心ID部分
      | (BigInt(this.machineId) << 12n)             // 机器ID部分
      | BigInt(this.sequence);                      // 序列号部分

    this.sequence = (this.sequence + 1) & 4095; // 序列号自增并循环

    if (this.sequence === 0) { // 如果序列号溢出，需要等待下一毫秒
      timestamp = await this.waitNextMillis(BigInt(timestamp));
      this.lastTimestamp = Number(timestamp);
    }
    return id;
  }

  async generateId(): Promise<string> {
    const id = await this.generateIdNumber();
    return id.toString(10);
  }

  private async waitNextMillis(lastTimestamp: bigint): Promise<bigint> {
    const timestamp = BigInt(Date.now());
    if (timestamp > lastTimestamp) {
      return timestamp;
    }
    return new Promise((resolve) => setTimeout(() => resolve(this.waitNextMillis(lastTimestamp))));
  }
}