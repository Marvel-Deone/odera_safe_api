import { Test, TestingModule } from '@nestjs/testing';
import { ShiftSwapService } from './shift-swap.service';

describe('ShiftSwapService', () => {
  let service: ShiftSwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShiftSwapService],
    }).compile();

    service = module.get<ShiftSwapService>(ShiftSwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
