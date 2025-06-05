import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaClientService implements OnModuleInit {
  private producer: Producer;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const broker = this.configService.get<string>('KAFKA_BROKER');
    if (!broker) {
      throw new Error('KAFKA_BROKER is not defined in environment');
    }

    const kafka = new Kafka({
      brokers: [broker],
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID') || 'totem-client',
    });

    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async emit(topic: string, message: Record<string, any>) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
