import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Log4j } from '@miup/nest-log4j';
import { ConfigService } from '@miup/nest-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8088);
}

bootstrap();
