import { NestFactory } from '@nestjs/core';
import { TotemApiGatewayModule } from './totem-api-gateway.module';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(TotemApiGatewayModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Totem API Gateway')
    .setDescription('Documentation de l’API REST centrale de Totem')
    .setVersion('1.0')
    .addTag('profiles')
    .addTag('branches')
    .addTag('badges')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
