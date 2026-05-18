import { Test, TestingModule } from '@nestjs/testing';
import { PatrolMonitoringService } from './patrol-monitoring.service';

describe('PatrolMonitoringService', () => {
  let service: PatrolMonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatrolMonitoringService],
    }).compile();

    service = module.get<PatrolMonitoringService>(PatrolMonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
