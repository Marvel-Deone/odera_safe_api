import { Test, TestingModule } from '@nestjs/testing';
import { GuardSosService } from './guard-sos.service';

describe('GuardSosService', () => {
  let service: GuardSosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuardSosService],
    }).compile();

    service = module.get<GuardSosService>(GuardSosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
