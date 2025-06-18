import { NestFactory } from '@nestjs/core';
import { TotemApiGatewayModule } from './totem-api-gateway.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { CustomHttpExceptionFilter } from '../../totem-mongo/src/shared/filters/CustomHttpExceptionFilter.filter';
import { RpcToHttpInterceptor } from '../src/interceptors/rpc-exception.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(TotemApiGatewayModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Lecture des cookies
  app.use(cookieParser());

  // ✅ Active CORS pour autoriser ton frontend
  app.enableCors({
    origin: 'http://localhost:3005',
    credentials: true,
  });

  // ➕ Connexion du microservice Kafka
  /*app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'totem-api-gateway-group',
      },
    },
  });*/

  //Interceptor API
  app.useGlobalInterceptors(new RpcToHttpInterceptor());

  // 📘 Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Totem API Gateway')
    .setDescription('Documentation de l’API REST centrale de Totem')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new CustomHttpExceptionFilter());

  // ⏯ Lancer HTTP + Kafka microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway is running at http://localhost:3000');
  console.log('📘 Swagger: http://localhost:3000/api/docs');
}
bootstrap();
