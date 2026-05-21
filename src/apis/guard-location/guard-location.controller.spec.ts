import { Test, TestingModule } from '@nestjs/testing';
import { GuardLocationController } from './guard-location.controller';

describe('GuardLocationController', () => {
  let controller: GuardLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardLocationController],
    }).compile();

    controller = module.get<GuardLocationController>(GuardLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
