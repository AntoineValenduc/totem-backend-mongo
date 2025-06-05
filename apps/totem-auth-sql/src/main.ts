import { NestFactory } from '@nestjs/core';
import { TotemAuthSqlModule } from './totem-auth-sql.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TotemAuthSqlModule);
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') || 3002);
}
bootstrap();
