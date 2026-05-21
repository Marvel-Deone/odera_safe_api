import { Test, TestingModule } from '@nestjs/testing';
import { GuardLocationService } from './guard-location.service';

describe('GuardLocationService', () => {
  let service: GuardLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardLocationService],
    }).compile();

    service = module.get<GuardLocationService>(GuardLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
