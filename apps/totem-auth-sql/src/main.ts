import { NestFactory } from '@nestjs/core';
import { TotemAuthSqlModule } from './totem-auth-sql.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(TotemAuthSqlModule);

  const config = app.get(ConfigService);

  // 🔐 Ajoute cookie-parser
  app.use(cookieParser());

  // 🌐 Active les CORS pour accepter les cookies cross-origin
  app.enableCors({
    origin: 'http://localhost:3005', // ton front Next.js
    credentials: true, // important pour les cookies
  });

  await app.listen(config.get('PORT_TOTEM_AUTH') ?? 3002);
}
void bootstrap().then(() =>
  console.log('🚀 Microservice Totem-Auth-Sql is running on port 3002'),
);
