import { Module } from '@nestjs/common';
import { TotemApiGatewayController } from './totem-api-gateway.controller';
import { TotemApiGatewayService } from './totem-api-gateway.service';
import { TotemMongoModule } from '../../totem-mongo/src/totem-mongo.module';
import {ProfilesModule} from "./profiles/profiles.module";

@Module({
  imports: [ProfilesModule],
  controllers: [TotemApiGatewayController],
  providers: [TotemApiGatewayService],
})
export class TotemApiGatewayModule {}
