import { Test, TestingModule } from '@nestjs/testing';
import { ShiftSwapController } from './shift-swap.controller';

describe('ShiftSwapController', () => {
  let controller: ShiftSwapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftSwapController],
    }).compile();

    controller = module.get<ShiftSwapController>(ShiftSwapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
