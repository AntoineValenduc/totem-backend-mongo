import { Test, TestingModule } from '@nestjs/testing';
import { TotemApiGatewayController } from './totem-api-gateway.controller';
import { TotemApiGatewayService } from './totem-api-gateway.service';

describe('TotemApiGatewayController', () => {
  let totemApiGatewayController: TotemApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TotemApiGatewayController],
      providers: [TotemApiGatewayService],
    }).compile();

    totemApiGatewayController = app.get<TotemApiGatewayController>(TotemApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(totemApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
