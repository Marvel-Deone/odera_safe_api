import { Test, TestingModule } from '@nestjs/testing';
import { GuardSosController } from './guard-sos.controller';

describe('GuardSosController', () => {
  let controller: GuardSosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuardSosController],
    }).compile();

    controller = module.get<GuardSosController>(GuardSosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
