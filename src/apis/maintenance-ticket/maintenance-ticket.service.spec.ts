import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceTicketService } from './maintenance-ticket.service';

describe('MaintenanceTicketService', () => {
  let service: MaintenanceTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceTicketService],
    }).compile();

    service = module.get<MaintenanceTicketService>(MaintenanceTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
