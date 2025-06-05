// libs/auth/kafka/src/kafka.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getKafkaConfig } from './kafka.config';
import { KafkaClientService } from './kafka-client.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => getKafkaConfig(configService),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [KafkaClientService],
  exports: [KafkaClientService],
})
export class KafkaModule {}
