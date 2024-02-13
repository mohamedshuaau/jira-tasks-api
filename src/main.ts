import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = new LoggerService();
  app.enableCors();
  app.use(loggerMiddleware(loggerService));
  await app.listen(8000);
}
bootstrap();
