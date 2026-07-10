import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import { AdminHeavyVehicleController, HeavyVehicleController } from './heavy-vehicle.controller'
import { HeavyVehicleService } from './heavy-vehicle.service'
import { EstateConfigService } from '../estate-config/estate-config.service'

@Module({
  imports: [PrismaModule],
  controllers: [HeavyVehicleController, AdminHeavyVehicleController],
  providers: [HeavyVehicleService, EstateConfigService],
})
export class HeavyVehicleModule {}
