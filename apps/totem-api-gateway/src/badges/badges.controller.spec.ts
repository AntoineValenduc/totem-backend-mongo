import { Test, TestingModule } from '@nestjs/testing';
import { BadgesController } from './badges.controller';

describe('BadgesController', () => {
  let controller: BadgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BadgesController],
    }).compile();

    controller = module.get<BadgesController>(BadgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
