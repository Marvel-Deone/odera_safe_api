import { Module } from '@nestjs/common'
import { PrismaModule } from '../../database/prisma/prisma.module'
import {
  AdminEstateConfigController,
  EstateConfigController,
  PublicEstateController,
} from './estate-config.controller'
import { EstateConfigService } from './estate-config.service'

@Module({
  imports: [PrismaModule],
  controllers: [PublicEstateController, EstateConfigController, AdminEstateConfigController],
  providers: [EstateConfigService],
})
export class EstateConfigModule {}
