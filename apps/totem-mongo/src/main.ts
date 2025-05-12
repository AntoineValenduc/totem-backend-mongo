import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TotemMongoModule } from './totem-mongo.module';
import { CustomRpcExceptionFilter } from './shared/filters/CustomRpcExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TotemMongoModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001,
      },
    },
  );
  app.useGlobalFilters(new CustomRpcExceptionFilter());

  await app.listen();
}

void bootstrap().then(() =>
  console.log('🚀 Microservice Totem-Mongo is running on port 3001'),
);
