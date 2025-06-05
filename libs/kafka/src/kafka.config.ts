import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const getKafkaConfig = (configService: ConfigService): ClientProviderOptions => ({
  name: 'KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'totem-client',
      brokers: [configService.get<string>('KAFKA_BROKER') ?? 'localhost:9092'],
    },
    consumer: {
      groupId: 'totem-consumer', // ⚠️ unique groupId par microservice
    },
  },
});
