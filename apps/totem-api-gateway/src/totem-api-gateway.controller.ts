import { Controller, Get } from '@nestjs/common';
import { TotemApiGatewayService } from './totem-api-gateway.service';

@Controller()
export class TotemApiGatewayController {
  constructor(
    private readonly totemApiGatewayService: TotemApiGatewayService,
  ) {}

  @Get()
  getHello(): string {
    return this.totemApiGatewayService.getHello();
  }
}
