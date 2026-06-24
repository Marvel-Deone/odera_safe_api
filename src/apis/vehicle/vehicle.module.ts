import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module';
import { AdminVehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';

@Module({
  imports: [PrismaModule],
  providers: [VehicleService],
  controllers: [VehicleController, AdminVehicleController],
})
export class VehicleModule {}
