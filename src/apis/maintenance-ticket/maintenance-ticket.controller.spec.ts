import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceTicketController } from './maintenance-ticket.controller';

describe('MaintenanceTicketController', () => {
  let controller: MaintenanceTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceTicketController],
    }).compile();

    controller = module.get<MaintenanceTicketController>(MaintenanceTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
