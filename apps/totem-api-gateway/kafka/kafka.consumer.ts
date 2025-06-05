// apps/totem-api-gateway/kafka/kafka.consumer.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class KafkaConsumerController {
  private readonly logger = new Logger(KafkaConsumerController.name);

  @MessagePattern('badge-created')
  handleBadgeCreated(@Payload() message: any) {
    this.logger.log(`📥 Message reçu sur topic 'badge-created': ${JSON.stringify(message.value)}`);
    // Tu peux ici appeler un service ou manipuler les données
  }

  @MessagePattern('profile-updated')
  handleProfileUpdated(@Payload() message: any) {
    this.logger.log(`📥 Message reçu sur topic 'profile-updated': ${JSON.stringify(message.value)}`);
    // Traitement logique ici aussi
  }
}
