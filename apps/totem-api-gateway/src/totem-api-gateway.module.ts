import { Module } from '@nestjs/common';
import { TotemApiGatewayController } from './totem-api-gateway.controller';
import { TotemApiGatewayService } from './totem-api-gateway.service';
import { TotemMongoModule } from './totem-mongo.module';

@Module({
  imports: [TotemMongoModule],
  controllers: [TotemApiGatewayController],
  providers: [TotemApiGatewayService],
})
export class TotemApiGatewayModule {}
