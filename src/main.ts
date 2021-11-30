import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Log4j } from '@miup/nest-log4j';
import { ConfigService } from '@miup/nest-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(Log4j);
  const config = app.get<ConfigService>(ConfigService);
  app.useLogger(logger);
  await app.listen(config.get<number>('port'));
}

bootstrap();
